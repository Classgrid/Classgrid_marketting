import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// Cryptographic hashes removed, replaced by short_code lookup

function createErrorPage(title: string, message: string) {
  return new NextResponse(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title} | Classgrid</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}.c{max-width:460px;padding:40px;background:#fff;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);text-align:center;border:1px solid #eaeaea}h1{color:#b91c1c;font-size:22px;margin:16px 0 12px;font-weight:600}p{color:#4b5563;font-size:15px;line-height:1.6}a{display:inline-block;margin-top:24px;padding:10px 24px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500}a:hover{background:#333}</style></head>
<body><div class="c">
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
<h1>${title}</h1><p>${message}</p>
<a href="/">Go to Homepage</a>
</div></body></html>`, { headers: { "Content-Type": "text/html" }, status: 400 });
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shortCode = searchParams.get("c");

    if (!shortCode) {
      return NextResponse.redirect(new URL("/blog", req.url));
    }

    // Lookup the email associated with this short code
    const { data: subscriberData, error: lookupError } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("short_code", shortCode)
      .maybeSingle();

    if (lookupError || !subscriberData?.email) {
      return createErrorPage("Expired or Invalid Link", "This unsubscribe link is no longer valid or the code is incorrect. Please use the latest email you received.");
    }

    const email = subscriberData.email;

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
        return createErrorPage("Unsubscribe Failed", "We couldn't process your request. Please try again later or contact support@classgrid.in.");
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
        return createErrorPage("Unsubscribe Failed", "We couldn't process your request. Please try again later or contact support@classgrid.in.");
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
    return createErrorPage("Something Went Wrong", "We couldn't process your unsubscribe request. Please try again later or contact support@classgrid.in.");
  }
}
