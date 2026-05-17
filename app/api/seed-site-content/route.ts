import { NextResponse } from "next/server";

import { reindexPlatformKnowledge } from "@/lib/ai/platform-knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const platform = await reindexPlatformKnowledge();

    return NextResponse.json({
      ok: true,
      message:
        "Reindexed platform knowledge from Sanity/indexed website and codebase content. Legacy manual static facts were removed and no manual facts were seeded.",
      platform,
    });
  } catch (err) {
    console.error("Platform knowledge reindex error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
