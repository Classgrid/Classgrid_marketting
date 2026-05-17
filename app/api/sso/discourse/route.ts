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

    // Override return_sso_url — Discourse's dev Rails server internally reports port 3000
    // which conflicts with our Next.js server. Force it to the Ember-served URL (port 4200).
    const forumBaseUrl = process.env.NEXT_PUBLIC_FORUM_URL || "http://localhost:4200";
    const returnUrl = `${forumBaseUrl}/session/sso_login`;

    // Build return payload
    const user = session.user as any;
    
    const returnParams = new URLSearchParams();
    returnParams.set("nonce", nonce);
    returnParams.set("email", user.email || "");
    returnParams.set("external_id", user.id || "");
    if (user.name) returnParams.set("name", user.name);
    if (user.image) returnParams.set("avatar_url", user.image);
    
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
  } catch (error) {
    console.error("SSO Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
