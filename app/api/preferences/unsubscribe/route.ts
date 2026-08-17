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

    if (!targetEmailParam || !token) {
      return NextResponse.json({ error: "Invalid unsubscribe link." }, { status: 400 });
    }

    if (!["blog", "changelog", "legal"].includes(type)) {
      return NextResponse.json({ error: "Invalid unsubscribe type." }, { status: 400 });
    }

    // Verify the cryptographic token
    const expectedToken = generateUnsubscribeHash(targetEmailParam);
    if (token !== expectedToken) {
      return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 403 });
    }

    // ── Step 1: If NOT logged in → redirect to login page ──
    if (!loggedInEmail) {
      const loginUrl = `/login?intent=unsubscribe&type=${type}&email=${encodeURIComponent(targetEmailParam)}&token=${token}`;
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // ── Step 2: If logged in with WRONG email → force logout, show error ──
    if (loggedInEmail.toLowerCase() !== targetEmailParam.toLowerCase()) {
      const errorUrl = `/logout?callbackUrl=${encodeURIComponent(`/login?intent=unsubscribe&type=${type}&email=${encodeURIComponent(targetEmailParam)}&token=${token}&error=OAuthAccountNotLinked`)}`;
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
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
