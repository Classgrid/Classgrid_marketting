import { NextResponse } from "next/server";

import {
  generateClassgridRagAnswer,
  type ChatHistoryItem,
} from "@/lib/ai/rag-answer";
import { normalizeText, type PageContext } from "@/lib/ai/rag-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AskAiRequestBody = {
  question?: string;
  userName?: string;
  history?: ChatHistoryItem[];
  pageContext?: PageContext;
};

const DEFAULT_ERROR_MESSAGE = "Unable to answer right now. Please try again.";

function normalizePageContext(input: unknown): PageContext | undefined {
  if (!input || typeof input !== "object") return undefined;
  const raw = input as Record<string, unknown>;

  const pageContext: PageContext = {
    path: normalizeText(raw.path),
    slug: normalizeText(raw.slug),
    title: normalizeText(raw.title),
    pageId: normalizeText(raw.pageId),
    locale: normalizeText(raw.locale),
    summary: normalizeText(raw.summary),
    hash: normalizeText(raw.hash),
    section: normalizeText(raw.section),
  };

  return Object.values(pageContext).some(Boolean) ? pageContext : undefined;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AskAiRequestBody;
    const question = normalizeText(body?.question);

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const result = await generateClassgridRagAnswer({
      question,
      channel: "web",
      userName: normalizeText(body?.userName),
      history: body?.history,
      pageContext: normalizePageContext(body?.pageContext),
    });

    return NextResponse.json(
      {
        answer: result.answer || DEFAULT_ERROR_MESSAGE,
        sources: result.sources.map((source) => ({
          documentId: source.documentId,
          documentType: source.documentType,
          pageTitle: source.pageTitle,
          pageSlug: source.pageSlug,
          section: source.section,
          sourceUrl: source.sourceUrl,
          score: source.score,
        })),
        retrieval: {
          chunks: result.sources.length,
          usedFallbackSearch: result.retrieval.usedFallbackSearch,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ask-ai]", message);
    return NextResponse.json({ answer: DEFAULT_ERROR_MESSAGE }, { status: 200 });
  }
}
