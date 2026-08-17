import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

function generateUnsubscribeHash(email: string): string {
  const secret = process.env.SANITY_WEBHOOK_SECRET || "classgrid_fallback";
  return crypto.createHmac("sha256", secret).update(email).digest("hex").slice(0, 32);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const loggedInEmail = session?.user?.email;

    const type = req.nextUrl.searchParams.get("type") || "blog";
    const targetEmailParam = req.nextUrl.searchParams.get("email");
    const token = req.nextUrl.searchParams.get("token");

    // Identify the target email from the token
    let targetEmail = targetEmailParam;

    if (token && !targetEmailParam) {
      // Legacy behavior: lookup by Supabase UUID token
      const { data: subscriber } = await supabaseAdmin
        .from("blog_subscribers")
        .select("email")
        .eq("unsubscribe_token", token)
        .maybeSingle();
      if (subscriber?.email) targetEmail = subscriber.email;
    } else if (targetEmailParam && token) {
      // New behavior: verify stateless HMAC token
      const expectedToken = generateUnsubscribeHash(targetEmailParam);
      if (token !== expectedToken) {
         return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 403 });
      }
    }

    if (!targetEmail || !token) {
      return NextResponse.json({ error: "Invalid unsubscribe link. Parameters missing." }, { status: 400 });
    }

    if (!loggedInEmail) {
      // Bounce to login, passing the intent, type, email, and token so it can redirect back here safely
      let loginUrl = `/login?intent=unsubscribe&type=${type}`;
      if (targetEmailParam) loginUrl += `&email=${encodeURIComponent(targetEmailParam)}`;
      loginUrl += `&token=${token}`;
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // STRICT VALIDATION: You must log in with the exact email the link was meant for!
    // This perfectly blocks cross-account unsubscriptions (e.g. quatuchem24 cannot unsubscribe nikhi.shinde)
    if (loggedInEmail.toLowerCase() !== targetEmail.toLowerCase()) {
      let errorUrl = `/login?intent=unsubscribe&type=${type}`;
      if (targetEmailParam) errorUrl += `&email=${encodeURIComponent(targetEmailParam)}`;
      errorUrl += `&token=${token}&error=OAuthAccountNotLinked`;
      return NextResponse.redirect(new URL(errorUrl, req.url));
    }

    if (!["blog", "changelog", "legal"].includes(type)) {
      return NextResponse.json({ error: "Invalid unsubscribe type." }, { status: 400 });
    }

    let updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (type === "legal") updatePayload.receives_legal = false;
    else if (type === "changelog") updatePayload.receives_changelog = false;
    else updatePayload.receives_blog = false;

    // Check if the user exists in Supabase
    const { data: existingUser } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("email", targetEmail)
      .maybeSingle();

    if (existingUser) {
      const { error: updateError } = await supabaseAdmin
        .from("blog_subscribers")
        .update(updatePayload)
        .eq("email", targetEmail);

      if (updateError) throw updateError;
    } else {
      // User is from MongoDB and not in Supabase yet. Insert them into the blocklist!
      const insertPayload = {
        email: targetEmail,
        name: "Subscriber",
        receives_blog: type !== "blog",
        receives_changelog: type !== "changelog",
        receives_legal: type !== "legal",
        unsubscribe_token: crypto.randomBytes(16).toString('hex')
      };
      const { error: insertError } = await supabaseAdmin.from("blog_subscribers").insert([insertPayload]);
      if (insertError) throw insertError;
    }

    // Redirect to the success confirmation page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const response = NextResponse.redirect(`${siteUrl}/blog/unsubscribed?type=${type}`);
    
    response.cookies.set("unsubscribed_session", "true", { maxAge: 30, path: "/", httpOnly: true, sameSite: "lax" });

    return response;
    
  } catch (error) {
    console.error("Error in unsubscribe callback:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
