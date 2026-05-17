import { NextResponse } from "next/server";
import {
  getBlogCounterCount,
  incrementBlogCounter,
  normalizeBlogSlug,
} from "@/lib/blogCounters";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const LIKE_WINDOW_MS = 60_000;
const LIKE_MAX_PER_WINDOW = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = normalizeBlogSlug(body?.slug);

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const ip = getClientIp(req);
    const gate = rateLimit({
      key: `blog-like:${ip}:${slug}`,
      max: LIKE_MAX_PER_WINDOW,
      windowMs: LIKE_WINDOW_MS,
    });
    if (!gate.allowed) {
      return NextResponse.json(
        { error: "Too many like requests. Please retry shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(gate.retryAfterSeconds) },
        }
      );
    }

    const count = await incrementBlogCounter("blog_likes", slug);
    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Quick Get wrapper for initial hydrate without bumping counter
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = normalizeBlogSlug(searchParams.get("slug"));

    if (!slug) return NextResponse.json({ count: 0 }, { status: 400 });

    const count = await getBlogCounterCount("blog_likes", slug);
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Like GET Error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
