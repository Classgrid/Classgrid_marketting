import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || "classgrid";

    const response = await fetch(`https://${pageId}.statuspage.io/api/v2/summary.json`, {
      next: { revalidate: 60 } // Cache the status for 60 seconds to prevent rate limits
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch status" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Status proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
