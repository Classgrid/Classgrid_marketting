import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Search docs by title and content using Sanity's text matching
  const results = await client.fetch(
    `*[_type == "apiDoc" && (title match $query || content match $query)] | order(title asc) [0...12] {
      "slug": slug.current,
      title,
      category,
      "snippet": pt::text(content)
    }`,
    { query: `${query}*` }
  );

  // Build lightweight results with content snippet
  const formatted = (results || []).map((doc: any) => {
    let snippet = "";
    if (doc.snippet) {
      // Find the query position in content and extract a surrounding snippet
      const lowerContent = (doc.snippet || "").toLowerCase();
      const lowerQuery = query.toLowerCase();
      const idx = lowerContent.indexOf(lowerQuery);
      if (idx !== -1) {
        const start = Math.max(0, idx - 60);
        const end = Math.min(lowerContent.length, idx + query.length + 80);
        snippet = (start > 0 ? "..." : "") + doc.snippet.slice(start, end).trim() + (end < lowerContent.length ? "..." : "");
      } else {
        // Just take the first 140 chars as a general snippet
        snippet = doc.snippet.slice(0, 140).trim() + (doc.snippet.length > 140 ? "..." : "");
      }
    }

    return {
      slug: doc.slug,
      title: doc.title,
      category: doc.category,
      snippet,
    };
  });

  return NextResponse.json({ results: formatted });
}
