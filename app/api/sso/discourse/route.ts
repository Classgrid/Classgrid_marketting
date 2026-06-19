import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sso = searchParams.get("sso");
    const sig = searchParams.get("sig");

    if (!sso || !sig) {
      return NextResponse.json({ error: "Missing sso or sig parameter" }, { status: 400 });
    }

    const secret = process.env.DISCOURSE_SSO_SECRET;
    if (!secret) {
      console.error("DISCOURSE_SSO_SECRET is not configured");
      return NextResponse.json({ error: "SSO not configured" }, { status: 500 });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(sso);
    const computedSig = hmac.digest("hex");

    if (computedSig !== sig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Check if user is logged in
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      // Redirect to login page and pass the sso and sig back so they can complete it after login
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect_discourse", "true");
      loginUrl.searchParams.set("sso", sso);
      loginUrl.searchParams.set("sig", sig);
      return NextResponse.redirect(loginUrl);
    }

    // Decode the SSO payload to get the return_sso_url and nonce
    const decodedSso = Buffer.from(sso, "base64").toString("utf-8");
    const ssoParams = new URLSearchParams(decodedSso);
    const nonce = ssoParams.get("nonce");

    if (!nonce) {
      return NextResponse.json({ error: "Invalid SSO payload - missing nonce" }, { status: 400 });
    }

    // Production forum URL — SSO callback redirects here after authentication
    let forumBaseUrl = process.env.NEXT_PUBLIC_FORUM_URL || "https://forum.classgrid.in";
    // Strip accidental '=' if user copy-pasted the env var badly
    forumBaseUrl = forumBaseUrl.replace(/^=/, "").trim();
    const returnUrl = `${forumBaseUrl}/session/sso_login`;

    // Connect to database to get the chosen username and consistent external_id
    await import('@/lib/mongodb').then(m => m.connectMongo());
    const ForumUser = (await import('@/lib/models/ForumUser')).default;
    
    const dbUser = await ForumUser.findOne({ 
      email: { $regex: new RegExp(`^${session.user.email}$`, 'i') } 
    });
    
    if (!dbUser) {
       return NextResponse.json({ error: "User profile not found in database" }, { status: 400 });
    }

    // Build return payload
    const user = session.user as any;
    
    const returnParams = new URLSearchParams();
    returnParams.set("nonce", nonce);
    returnParams.set("email", dbUser.email);
    // Always use the MongoDB ID as the external_id so it stays the same whether they use Google or Email
    returnParams.set("external_id", dbUser._id.toString());
    
    // CRITICAL: Pass the chosen username to Discourse
    if (dbUser.username) {
      returnParams.set("username", dbUser.username);
    }
    
    if (dbUser.name) returnParams.set("name", dbUser.name);
    if (dbUser.avatar || user.image) returnParams.set("avatar_url", dbUser.avatar || user.image);
    
    // If they are a platform user, add them to the platform_users group
    if (user.isPlatformUser) {
      returnParams.set("add_groups", "platform_users");
    }

    const returnPayload = Buffer.from(returnParams.toString()).toString("base64");
    
    const returnHmac = crypto.createHmac("sha256", secret);
    returnHmac.update(returnPayload);
    const returnSig = returnHmac.digest("hex");

    const finalUrl = new URL(returnUrl);
    finalUrl.searchParams.set("sso", returnPayload);
    finalUrl.searchParams.set("sig", returnSig);

    return NextResponse.redirect(finalUrl);
  } catch (error: any) {
    console.error("SSO Error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error?.message || String(error) }, { status: 500 });
  }
}
