import { NextResponse } from "next/server";
import {
  getBlogCounterCount,
  incrementBlogCounter,
  normalizeBlogSlug,
} from "@/lib/blogCounters";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const VIEW_WINDOW_MS = 60_000;
const VIEW_MAX_PER_WINDOW = 60;

function helpSlug(slug: string) {
  return `help__${slug}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = normalizeBlogSlug(body?.slug);
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const ip = getClientIp(req);
    const gate = rateLimit({ key: `help-view:${ip}:${slug}`, max: VIEW_MAX_PER_WINDOW, windowMs: VIEW_WINDOW_MS });
    if (!gate.allowed) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } });
    }

    const count = await incrementBlogCounter("blog_views", helpSlug(slug));
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Help View API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = normalizeBlogSlug(searchParams.get("slug"));
    if (!slug) return NextResponse.json({ count: 0 }, { status: 400 });

    const count = await getBlogCounterCount("blog_views", helpSlug(slug));
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Help View GET Error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
