import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const shortCode = req.nextUrl.searchParams.get("c");
    
    if (!shortCode) {
      return NextResponse.json({ error: "Missing short code" }, { status: 400 });
    }

    const { data: subscriber } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("short_code", shortCode)
      .maybeSingle();
      
    if (!subscriber || !subscriber.email) {
      return NextResponse.json({ error: "Invalid short code" }, { status: 400 });
    }

    return NextResponse.json({ email: subscriber.email }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
