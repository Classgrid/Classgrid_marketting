import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      // If they somehow hit this without a session, bounce them back to login
      const type = req.nextUrl.searchParams.get("type") || "blog";
      return NextResponse.redirect(new URL(`/login?intent=unsubscribe&type=${type}`, req.url));
    }

    const type = req.nextUrl.searchParams.get("type");

    if (!type || !["blog", "changelog", "legal"].includes(type)) {
      return NextResponse.json({ error: "Invalid unsubscribe type." }, { status: 400 });
    }

    // Determine which field to update
    let updateData: Record<string, boolean> = {};
    if (type === "blog") updateData.receives_blog = false;
    if (type === "changelog") updateData.receives_changelog = false;
    if (type === "legal") updateData.receives_legal = false;

    // Perform the update
    const { error } = await supabaseAdmin
      .from("blog_subscribers")
      .update(updateData)
      .eq("email", email.toLowerCase());

    if (error) {
      console.error("Supabase Error unsubscribing user:", error);
      return NextResponse.json({ error: "Failed to update preferences." }, { status: 500 });
    }

    // Redirect to the success confirmation page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const response = NextResponse.redirect(`${siteUrl}/blog/unsubscribed`);
    
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
