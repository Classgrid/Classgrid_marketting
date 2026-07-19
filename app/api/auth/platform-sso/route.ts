import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { getDashboardUrl } from "@/lib/platform-dashboard";

export const dynamic = "force-dynamic";

/**
 * SSO Bridge: Mints a platform-compatible JWT after NextAuth login.
 * Sets it as a cookie with domain .classgrid.in so the platform recognizes the user.
 * 
 * Flow:
 * 1. User logs in on marketing site via NextAuth (Google/GitHub/OTP)
 * 2. This API is called to mint a platform JWT
 * 3. Cookie "token" is set with domain .classgrid.in
 * 4. When user visits abc.classgrid.in, the platform reads this cookie → user is already logged in
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const base = process.env.NEXTAUTH_URL || "https://classgrid.in";

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = session.user as any;

  if (!user.isPlatformUser) {
    return NextResponse.json({ error: "Not a platform user" }, { status: 403 });
  }

  const platformJwtSecret = process.env.PLATFORM_JWT_SECRET;
  if (!platformJwtSecret) {
    console.error("[platform-sso] PLATFORM_JWT_SECRET env var is not set");
    return NextResponse.json({ error: "SSO not configured" }, { status: 500 });
  }

  try {
    await connectMongo();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Find the platform user to get their _id and organization_id
    const platformUser = await db.collection("users").findOne({
      email: { $regex: new RegExp(`^${session.user.email}$`, "i") },
    });

    if (!platformUser) {
      return NextResponse.json({ error: "Platform user not found" }, { status: 404 });
    }

    // Mint a platform-compatible JWT (same format as auth.controller.js generateToken)
    const token = jwt.sign(
      {
        id: platformUser._id,
        role: platformUser.role,
        organizationId: platformUser.organization_id || null,
      },
      platformJwtSecret,
      { expiresIn: "7d" }
    );

    // Build the dashboard URL
    const dashboardUrl = getDashboardUrl({
      role: user.platformRole,
      orgSubdomain: user.orgSubdomain,
      orgCustomDomain: user.orgCustomDomain,
      isCustomDomainEnabled: user.isCustomDomainEnabled,
    });

    // Set the platform token cookie
    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      dashboardUrl,
      token, // Also return token in body for client-side localStorage
    });

    // Set cookie with .classgrid.in domain so it works across all subdomains
    response.cookies.set("token", token, {
      domain: isProd ? ".classgrid.in" : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[platform-sso] Error:", error);
    return NextResponse.json({ error: "SSO failed" }, { status: 500 });
  }
}
