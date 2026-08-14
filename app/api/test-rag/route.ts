import { NextResponse } from "next/server";
import { retrieveClassgridContext } from "@/lib/ai/rag-retrieve";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "who is founder of classgrid";
    
    // Force RAG to be enabled for this test
    process.env.RAG_ENABLED = "true";

    const result = await retrieveClassgridContext(query, {});
    
    return NextResponse.json({
      success: true,
      query,
      usedFallbackSearch: result.usedFallbackSearch,
      chunkCount: result.chunks.length,
      contextText: result.contextText,
      chunks: result.chunks
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
