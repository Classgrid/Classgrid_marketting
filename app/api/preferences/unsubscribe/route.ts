import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

function generateUnsubscribeHash(email: string): string {
  const secret = process.env.SANITY_WEBHOOK_SECRET || "classgrid_fallback";
  return crypto.createHmac("sha256", secret).update(email).digest("hex").slice(0, 32);
}

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") || "blog";
    const token = req.nextUrl.searchParams.get("token");
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!token || !emailParam) {
      return NextResponse.json({ error: "Invalid unsubscribe link. Parameters missing." }, { status: 400 });
    }

    if (!["blog", "changelog", "legal"].includes(type)) {
      return NextResponse.json({ error: "Invalid unsubscribe type." }, { status: 400 });
    }

    // Isolate the session entirely: just verify the cryptographic signature or UUID token
    let targetEmail = emailParam;
    
    if (token && !emailParam) {
      // Legacy behavior: lookup by Supabase UUID token
      const { data: subscriber } = await supabaseAdmin
        .from("blog_subscribers")
        .select("email")
        .eq("unsubscribe_token", token)
        .maybeSingle();
      if (subscriber?.email) targetEmail = subscriber.email;
    } else if (emailParam && token) {
      // New behavior: verify stateless HMAC token
      const expectedToken = generateUnsubscribeHash(emailParam);
      if (token !== expectedToken) {
         return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 403 });
      }
    }

    if (!targetEmail || !token) {
      return NextResponse.json({ error: "Invalid unsubscribe link. Parameters missing." }, { status: 400 });
    }

    // Determine which field to update
    let updateData: Record<string, boolean> = {};
    if (type === "blog") updateData.receives_blog = false;
    if (type === "changelog") updateData.receives_changelog = false;
    if (type === "legal") updateData.receives_legal = false;

    // Perform the update only on the original recipient
    const { error } = await supabaseAdmin
      .from("blog_subscribers")
      .update(updateData)
      .eq("email", targetEmail);

    if (error) {
      console.error("Supabase Error unsubscribing user:", error);
      return NextResponse.json({ error: "Failed to update preferences." }, { status: 500 });
    }

    // Redirect to the success confirmation page
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
    console.error("Error in unsubscribe callback:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
