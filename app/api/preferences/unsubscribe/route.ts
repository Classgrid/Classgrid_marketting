import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// ─── Token generators ────────────────────────────────────────────────────────

/** New token: SHA-256 HMAC (used by platform email worker) */
function generateUnsubscribeHash(email: string): string {
  const secret = process.env.SANITY_WEBHOOK_SECRET || "classgrid_fallback";
  return crypto.createHmac("sha256", secret).update(email).digest("hex").slice(0, 32);
}

/** Legacy token: plain MD5 of email (used by old Express/Python backend) */
function generateLegacyHash(email: string): string {
  return crypto.createHash("md5").update(email).digest("hex");
}

/** Verify the token is valid via either scheme */
function isTokenValid(email: string, token: string): boolean {
  const hmacHash = generateUnsubscribeHash(email);
  const md5Hash = generateLegacyHash(email);
  const fallbackHash = crypto.createHmac("sha256", "classgrid_fallback").update(email).digest("hex").slice(0, 32);
  return token === hmacHash || token === md5Hash || token === fallbackHash;
}

// ─── Route ───────────────────────────────────────────────────────────────────
// This route is 100% STATELESS. It does NOT use getServerSession, does NOT
// redirect to /login, and does NOT touch any existing Docs/Marketing session.
// It identifies the recipient purely from the signed email+token in the URL.

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") || "blog";
    const email = req.nextUrl.searchParams.get("email");
    const token = req.nextUrl.searchParams.get("token");

    // Both email and token are required — no session fallback ever
    if (!email || !token) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link. Missing parameters." },
        { status: 400 }
      );
    }

    if (!["blog", "changelog", "legal"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid unsubscribe type." },
        { status: 400 }
      );
    }

    // Verify the cryptographic token matches the email — this is the ONLY
    // authentication. No session, no login, no cookies are read or written
    // for auth purposes. The existing Docs/Marketing session is untouched.
    if (!isTokenValid(email, token)) {
      return NextResponse.json(
        { error: "Invalid or expired unsubscribe link." },
        { status: 403 }
      );
    }

    // Build the update payload for the specific type
    const targetEmail = email;
    let updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };

    if (type === "legal") {
      updatePayload.receives_legal = false;
    } else if (type === "changelog") {
      updatePayload.receives_changelog = false;
    } else {
      updatePayload.receives_blog = false;
    }

    // Check if the user exists in Supabase
    const { data: existingUser } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("email", targetEmail)
      .maybeSingle();

    if (existingUser) {
      // Update the specific preference to false
      const { error: updateError } = await supabaseAdmin
        .from("blog_subscribers")
        .update(updatePayload)
        .eq("email", targetEmail);

      if (updateError) {
        console.error("Unsubscribe DB Update Error:", updateError);
        return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
      }
    } else {
      // User is from MongoDB and not in Supabase yet — insert into the blocklist
      const insertPayload = {
        email: targetEmail,
        name: "Subscriber",
        receives_blog: type !== "blog",
        receives_changelog: type !== "changelog",
        receives_legal: type !== "legal",
        unsubscribe_token: crypto.randomBytes(16).toString("hex"),
      };

      const { error: insertError } = await supabaseAdmin
        .from("blog_subscribers")
        .insert([insertPayload]);

      if (insertError) {
        console.error("Unsubscribe DB Insert Error:", insertError);
        return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
      }
    }

    // Redirect to the success confirmation page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const response = NextResponse.redirect(`${siteUrl}/blog/unsubscribed?type=${type}`);

    // Short-lived cookie for the success screen only (NOT an auth cookie)
    response.cookies.set("unsubscribed_session", "true", {
      maxAge: 30,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("Error in unsubscribe callback:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
