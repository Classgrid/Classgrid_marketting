import {
  detectBookDemoIntent,
  detectPricingIntent,
  expandRetrievalQueryForIntent,
} from "@/lib/ai/rag-intents";
import { embedText } from "@/lib/ai/embedding";
import { normalizePageSlug, normalizeText, type PageContext } from "@/lib/ai/rag-content";
import { connectMongo } from "@/lib/mongodb";
import { RagChunk } from "@/lib/models/RagChunk";

export type RetrievedRagChunk = {
  id: string;
  documentId: string;
  documentType: string;
  chunkIndex: number;
  chunkText: string;
  pageSlug?: string;
  pageTitle?: string;
  section?: string;
  contentType?: string;
  sourceUrl?: string;
  score: number;
};

export type RetrieveRagOptions = {
  topK?: number;
  minScore?: number;
  numCandidates?: number;
  pageContext?: PageContext;
  contentTypes?: string[];
};

export type RagRetrievalResult = {
  chunks: RetrievedRagChunk[];
  contextText: string;
  usedFallbackSearch: boolean;
};

const DEFAULT_TOP_K = 8;
const DEFAULT_NUM_CANDIDATES = 80;
const VECTOR_INDEX_NAME = process.env.RAG_VECTOR_INDEX || process.env.MONGODB_VECTOR_INDEX || "vector_index";

function toRetrievedChunk(row: any): RetrievedRagChunk {
  return {
    id: String(row._id || `${row.documentId}:${row.chunkIndex}`),
    documentId: String(row.documentId || ""),
    documentType: String(row.documentType || row.contentType || ""),
    chunkIndex: Number(row.chunkIndex || 0),
    chunkText: String(row.chunkText || ""),
    pageSlug: row.pageSlug ? String(row.pageSlug) : undefined,
    pageTitle: row.pageTitle ? String(row.pageTitle) : undefined,
    section: row.section ? String(row.section) : undefined,
    contentType: row.contentType ? String(row.contentType) : undefined,
    sourceUrl: row.sourceUrl ? String(row.sourceUrl) : undefined,
    score: typeof row.score === "number" ? row.score : 0,
  };
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let aMag = 0;
  let bMag = 0;
  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    aMag += a[i] * a[i];
    bMag += b[i] * b[i];
  }

  if (!aMag || !bMag) return 0;
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
}

function normalizeContextSlug(pageContext?: PageContext) {
  if (!pageContext) return "";
  return normalizePageSlug(pageContext.slug || pageContext.path || "");
}

function pageContextMatches(chunk: RetrievedRagChunk, pageContext?: PageContext) {
  if (!pageContext) return false;

  const contextSlug = normalizeContextSlug(pageContext);
  const chunkSlug = normalizePageSlug(chunk.pageSlug || "");
  const contextPath = normalizePageSlug(pageContext.path || "");
  const sourcePath = normalizePageSlug(chunk.sourceUrl || "");
  const pageId = normalizeText(pageContext.pageId);

  return Boolean(
    (pageId && chunk.documentId === pageId) ||
      (contextSlug && chunkSlug && contextSlug === chunkSlug) ||
      (contextPath && sourcePath && sourcePath.endsWith(contextPath))
  );
}

function rerankWithPageBoost(chunks: RetrievedRagChunk[], pageContext?: PageContext) {
  return chunks
    .map((chunk) => ({
      ...chunk,
      score: chunk.score + (pageContextMatches(chunk, pageContext) ? 0.25 : 0),
    }))
    .sort((a, b) => b.score - a.score);
}

function uniqueValues(values: Array<string | undefined | null>) {
  return Array.from(new Set(values.map((value) => normalizePageSlug(value || "")).filter(Boolean)));
}

function intentPrioritySlugs(question: string, pageContext?: PageContext) {
  const slugs: string[] = [];
  const currentSlug = normalizeContextSlug(pageContext);

  if (currentSlug) slugs.push(currentSlug);
  if (detectPricingIntent(question)) slugs.push("pricing");
  if (detectBookDemoIntent(question)) slugs.push("demo", "home");

  return uniqueValues(slugs);
}

function scorePriorityChunk(chunk: RetrievedRagChunk, pageContext?: PageContext) {
  const contentType = normalizeText(chunk.contentType).toLowerCase();
  const sourceWeighted =
    contentType === "apppagesourcecontent" || contentType === "codebasecontent";

  return {
    ...chunk,
    score: (sourceWeighted ? 0.78 : 0.7) + (pageContextMatches(chunk, pageContext) ? 0.22 : 0),
  };
}

async function fetchIntentPriorityChunks(
  question: string,
  pageContext: PageContext | undefined,
  limit: number
): Promise<RetrievedRagChunk[]> {
  const slugs = intentPrioritySlugs(question, pageContext);
  if (!slugs.length) return [];

  const sourcePatterns = slugs.map((slug) => new RegExp(`/${slug}(?:$|[#?])`, "i"));
  const docs = await RagChunk.find({
    $or: [
      { pageSlug: { $in: slugs } },
      ...sourcePatterns.map((pattern) => ({ sourceUrl: pattern })),
    ],
  } as any)
    .select({
      documentId: 1,
      documentType: 1,
      chunkIndex: 1,
      chunkText: 1,
      pageSlug: 1,
      pageTitle: 1,
      section: 1,
      contentType: 1,
      sourceUrl: 1,
    })
    .limit(limit)
    .lean();

  return docs.map((doc) => scorePriorityChunk(toRetrievedChunk(doc), pageContext));
}

function dedupeChunks(chunks: RetrievedRagChunk[]) {
  const seen = new Set<string>();
  const deduped: RetrievedRagChunk[] = [];

  for (const chunk of chunks) {
    const key = `${chunk.documentId}:${chunk.chunkIndex}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(chunk);
  }

  return deduped;
}

function formatContext(chunks: RetrievedRagChunk[]) {
  return chunks
    .map((chunk, index) => {
      const heading = [
        `[${index + 1}]`,
        chunk.pageTitle || chunk.documentType || "Classgrid content",
        chunk.section ? `- ${chunk.section}` : "",
        chunk.sourceUrl ? `(${chunk.sourceUrl})` : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `${heading}\n${chunk.chunkText}`;
    })
    .join("\n\n---\n\n");
}

async function vectorSearch(
  queryEmbedding: number[],
  limit: number,
  numCandidates: number,
  filter?: Record<string, unknown>
): Promise<RetrievedRagChunk[]> {
  const vectorSearchStage: Record<string, unknown> = {
    index: VECTOR_INDEX_NAME,
    path: "embedding",
    queryVector: queryEmbedding,
    numCandidates,
    limit,
  };

  if (filter && Object.keys(filter).length > 0) {
    vectorSearchStage.filter = filter;
  }

  const rows = await RagChunk.aggregate([
    {
      $vectorSearch: vectorSearchStage,
    },
    {
      $project: {
        _id: 1,
        documentId: 1,
        documentType: 1,
        chunkIndex: 1,
        chunkText: 1,
        pageSlug: 1,
        pageTitle: 1,
        section: 1,
        contentType: 1,
        sourceUrl: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ] as any[]);

  return rows.map(toRetrievedChunk);
}

async function fallbackCosineSearch(
  queryEmbedding: number[],
  limit: number,
  contentTypes?: string[]
): Promise<RetrievedRagChunk[]> {
  const query = contentTypes?.length ? { contentType: { $in: contentTypes } } : {};
  const docs = await RagChunk.find(query as any)
    .select({
      documentId: 1,
      documentType: 1,
      chunkIndex: 1,
      chunkText: 1,
      embedding: 1,
      pageSlug: 1,
      pageTitle: 1,
      section: 1,
      contentType: 1,
      sourceUrl: 1,
    })
    .limit(2000)
    .lean();

  return docs
    .map((doc) =>
      toRetrievedChunk({
        ...doc,
        score: cosineSimilarity(queryEmbedding, Array.isArray(doc.embedding) ? doc.embedding : []),
      })
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function retrieveClassgridContext(
  question: string,
  options: RetrieveRagOptions = {}
): Promise<RagRetrievalResult> {
  const query = normalizeText(question);
  if (!query) {
    return { chunks: [], contextText: "", usedFallbackSearch: false };
  }

  // Skip RAG embedding when disabled (e.g. Vercel Hobby 10s timeout can't load @xenova/transformers)
  // AI still works via Groq + platform knowledge + guardrails, just without document-level context
  if (process.env.RAG_ENABLED !== "true") {
    return { chunks: [], contextText: "", usedFallbackSearch: false };
  }

  const retrievalQuery = expandRetrievalQueryForIntent(query);

  const topK = options.topK ?? DEFAULT_TOP_K;
  const limit = Math.max(topK * 4, topK);
  const numCandidates = options.numCandidates ?? DEFAULT_NUM_CANDIDATES;
  const minScore = options.minScore ?? 0;
  const contextSlug = normalizeContextSlug(options.pageContext);
  const queryEmbedding = await embedText(retrievalQuery);

  await connectMongo();

  let rows: RetrievedRagChunk[] = [];
  let usedFallbackSearch = false;
  rows.push(...(await fetchIntentPriorityChunks(query, options.pageContext, Math.max(topK * 2, 12))));

  try {
    if (contextSlug) {
      const pageRows = await vectorSearch(queryEmbedding, Math.max(4, topK), numCandidates, {
        pageSlug: contextSlug,
      });
      rows.push(...pageRows);
    }

    const filter = options.contentTypes?.length
      ? { contentType: { $in: options.contentTypes } }
      : undefined;
    rows.push(...(await vectorSearch(queryEmbedding, limit, numCandidates, filter)));
  } catch (error) {
    usedFallbackSearch = true;
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[rag] Atlas vector search failed, using local cosine fallback:", message);
    rows.push(...(await fallbackCosineSearch(queryEmbedding, limit, options.contentTypes)));
  }

  if (rows.length === 0) {
    usedFallbackSearch = true;
    rows = await fallbackCosineSearch(queryEmbedding, limit, options.contentTypes);
  }

  const filtered = rows.filter((chunk) => chunk.score >= minScore && chunk.chunkText.trim());
  const ranked = rerankWithPageBoost(dedupeChunks(filtered), options.pageContext).slice(0, topK);

  return {
    chunks: ranked,
    contextText: formatContext(ranked),
    usedFallbackSearch,
  };
}
