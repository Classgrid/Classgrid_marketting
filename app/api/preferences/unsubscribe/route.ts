import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const loggedInEmail = session?.user?.email;

    const type = req.nextUrl.searchParams.get("type") || "blog";
    const shortCode = req.nextUrl.searchParams.get("c");

    if (!shortCode) {
      return createErrorPage("Invalid Unsubscribe Link", "This unsubscribe link is missing the required code. Please use the exact link from your email.");
    }

    if (!["blog", "changelog", "legal"].includes(type)) {
      return createErrorPage("Invalid Unsubscribe Link", "The unsubscribe type is not recognized.");
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

    const targetEmailParam = subscriberData.email;

    // ── Step 1: If NOT logged in → redirect to login page ──
    if (!loggedInEmail) {
      const loginUrl = `/login?intent=unsubscribe&type=${type}&c=${shortCode}`;
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // ── Step 2: If logged in with WRONG email → force logout, show error ──
    if (loggedInEmail.toLowerCase() !== targetEmailParam.toLowerCase()) {
      const errorUrl = `/logout?callbackUrl=${encodeURIComponent(`/login?intent=unsubscribe&type=${type}&c=${shortCode}&error=OAuthAccountNotLinked`)}`;
      return NextResponse.redirect(new URL(errorUrl, req.url));
    }

    // ── Step 3: Logged in with CORRECT email → proceed with unsubscribe ──
    let updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (type === "legal") updatePayload.receives_legal = false;
    else if (type === "changelog") updatePayload.receives_changelog = false;
    else updatePayload.receives_blog = false;

    // Check if user exists in Supabase
    const { data: existingUser } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("email", targetEmailParam)
      .maybeSingle();

    if (existingUser) {
      const { error: updateError } = await supabaseAdmin
        .from("blog_subscribers")
        .update(updatePayload)
        .eq("email", targetEmailParam);
      if (updateError) throw updateError;
    } else {
      // MongoDB user not in Supabase yet — insert into blocklist
      const insertPayload = {
        email: targetEmailParam,
        name: "Subscriber",
        receives_blog: type !== "blog",
        receives_changelog: type !== "changelog",
        receives_legal: type !== "legal",
        unsubscribe_token: crypto.randomBytes(16).toString("hex"),
      };
      const { error: insertError } = await supabaseAdmin.from("blog_subscribers").insert([insertPayload]);
      if (insertError) throw insertError;
    }

    // Redirect to success page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const response = NextResponse.redirect(`${siteUrl}/blog/unsubscribed?type=${type}`);
    response.cookies.set("unsubscribed_session", "true", {
      maxAge: 30,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("Error in unsubscribe callback:", error);
    return createErrorPage("Something Went Wrong", "We couldn't process your unsubscribe request. Please try again later or contact support@classgrid.in.");
  }
}
