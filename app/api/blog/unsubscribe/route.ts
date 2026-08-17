import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// ─── Token generators ────────────────────────────────────────────────────────

/** New token: SHA-256 HMAC (used by this Next.js app) */
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.redirect(new URL("/blog", req.url));
    }

    // Verify the token (accepts both old MD5 and new HMAC tokens)
    if (!isTokenValid(email, token)) {
      return NextResponse.json(
        { error: "Invalid or expired unsubscribe link." },
        { status: 403 }
      );
    }

    const type = searchParams.get("type") || "blog";
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
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      // Soft-delete: set the specific preference to false
      const { error: updateError } = await supabaseAdmin
        .from("blog_subscribers")
        .update(updatePayload)
        .eq("email", email);

      if (updateError) {
        console.error("Unsubscribe DB Update Error:", updateError);
        return NextResponse.json({ error: "Failed to unsubscribe. Please try again." }, { status: 500 });
      }
    } else {
      // User is from MongoDB and not in Supabase yet. Insert them into the blocklist!
      const insertPayload = {
        email: email,
        name: "Subscriber", // Fallback name
        receives_blog: type !== "blog", // True if they didn't unsubscribe from blog
        receives_changelog: type !== "changelog",
        receives_legal: type !== "legal",
        unsubscribe_token: crypto.randomBytes(16).toString('hex') // Generate a proper DB token for them
      };

      const { error: insertError } = await supabaseAdmin
        .from("blog_subscribers")
        .insert([insertPayload]);

      if (insertError) {
        console.error("Unsubscribe DB Insert Error:", insertError);
        return NextResponse.json({ error: "Failed to unsubscribe. Please try again." }, { status: 500 });
      }
    }

    // Redirect to the confirmation page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const response = NextResponse.redirect(`${siteUrl}/blog/unsubscribed?type=${type}`);
    
    // Set a short-lived cookie so the user can view the success screen just once
    response.cookies.set("unsubscribed_session", "true", {
      maxAge: 30, // Valid for 30 seconds
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("Unsubscribe Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
