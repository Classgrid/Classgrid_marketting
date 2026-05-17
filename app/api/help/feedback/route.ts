import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const FEEDBACK_WINDOW_MS = 60_000;
const FEEDBACK_MAX_PER_WINDOW = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, isHelpful } = body;

    if (!slug || typeof isHelpful !== "boolean") {
      return NextResponse.json({ error: "Missing slug or feedback value" }, { status: 400 });
    }

    const ip = getClientIp(req);
    const gate = rateLimit({ key: `help-feedback:${ip}:${slug}`, max: FEEDBACK_MAX_PER_WINDOW, windowMs: FEEDBACK_WINDOW_MS });
    if (!gate.allowed) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } });
    }

    const { error } = await supabaseAdmin
      .from("help_article_feedback")
      .insert({ slug, is_helpful: isHelpful });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Help Feedback API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
