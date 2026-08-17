import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") || "blog";
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Invalid unsubscribe link. Token missing." }, { status: 400 });
    }

    if (!["blog", "changelog", "legal"].includes(type)) {
      return NextResponse.json({ error: "Invalid unsubscribe type." }, { status: 400 });
    }

    // Identify the original recipient securely from the unique token
    const { data: subscriber, error: fetchError } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("unsubscribe_token", token)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching subscriber by token:", fetchError);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }

    if (!subscriber || !subscriber.email) {
      // If the email is already unsubscribed/deleted or the token is bad, don't fallback to logged-in user!
      return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 400 });
    }

    const targetEmail = subscriber.email;

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
