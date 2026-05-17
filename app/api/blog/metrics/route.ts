import { NextResponse } from "next/server";
import {
  getBlogCounterMap,
  normalizeBlogSlug,
} from "@/lib/blogCounters";

const MAX_METRIC_SLUGS = 120;
const LIKE_WEIGHT = 3;
const VIEW_WEIGHT = 1;

function getRequestedSlugs(req: Request): string[] {
  const { searchParams } = new URL(req.url);
  const fromList = searchParams.getAll("slug");
  const csv = searchParams.get("slugs");
  const fromCsv = csv ? csv.split(",") : [];
  const normalized = [...fromList, ...fromCsv]
    .map((value) => normalizeBlogSlug(value))
    .filter((value): value is string => !!value);

  return Array.from(new Set(normalized)).slice(0, MAX_METRIC_SLUGS);
}

export async function GET(req: Request) {
  try {
    const slugs = getRequestedSlugs(req);
    if (slugs.length === 0) {
      return NextResponse.json({ metrics: {} }, { status: 200 });
    }

    const [likesBySlug, viewsBySlug] = await Promise.all([
      getBlogCounterMap("blog_likes", slugs),
      getBlogCounterMap("blog_views", slugs),
    ]);

    const metrics: Record<string, { likes: number; views: number; score: number }> = {};
    for (const slug of slugs) {
      const likes = likesBySlug[slug] ?? 0;
      const views = viewsBySlug[slug] ?? 0;
      metrics[slug] = {
        likes,
        views,
        score: likes * LIKE_WEIGHT + views * VIEW_WEIGHT,
      };
    }

    return NextResponse.json({ metrics }, { status: 200 });
  } catch (error) {
    console.error("Blog metrics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
