import { createClient } from "next-sanity";

import { embedText, RAG_EMBEDDING_DIMENSIONS, RAG_EMBEDDING_MODEL } from "@/lib/ai/embedding";
import {
  chunkRagDocument,
  extractRagDocument,
  INDEXABLE_SANITY_TYPES,
  isIndexableSanityType,
} from "@/lib/ai/rag-content";
import { connectMongo } from "@/lib/mongodb";
import { RagChunk } from "@/lib/models/RagChunk";
import { apiVersion, dataset, projectId } from "@/sanity/env";

let sanityReadClient: ReturnType<typeof createClient> | null = null;

function getSanityReadClient() {
  if (!sanityReadClient) {
    sanityReadClient = createClient({
      projectId,
      dataset,
      apiVersion,
      perspective: "published",
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    });
  }

  return sanityReadClient;
}

export type RagSyncResult = {
  ok: boolean;
  action: "ignored" | "deleted" | "synced";
  documentId?: string;
  documentType?: string;
  chunks?: number;
  reason?: string;
};

export async function fetchSanityDocumentById(documentId: string): Promise<Record<string, unknown> | null> {
  const cleanId = documentId.replace(/^drafts\./, "");
  return getSanityReadClient().fetch<Record<string, unknown> | null>(
    `*[_id == $id || _id == $draftId][0]{...}`,
    { id: cleanId, draftId: `drafts.${cleanId}` },
    { cache: "no-store" }
  );
}

export async function fetchAllIndexableSanityDocuments(): Promise<Record<string, unknown>[]> {
  return getSanityReadClient().fetch<Record<string, unknown>[]>(
    `*[_type in $types && !(_id in path("drafts.**"))]{...}`,
    { types: INDEXABLE_SANITY_TYPES },
    { cache: "no-store" }
  );
}

export async function deleteRagChunksForDocument(documentId: string): Promise<RagSyncResult> {
  const cleanId = documentId.replace(/^drafts\./, "");
  await connectMongo();
  await RagChunk.deleteMany({ documentId: { $in: [documentId, cleanId, `drafts.${cleanId}`] } });
  return {
    ok: true,
    action: "deleted",
    documentId: cleanId,
  };
}

export async function syncSanityDocumentToRag(
  documentOrId: string | Record<string, unknown>
): Promise<RagSyncResult> {
  const doc =
    typeof documentOrId === "string" ? await fetchSanityDocumentById(documentOrId) : documentOrId;

  if (!doc) {
    return {
      ok: false,
      action: "ignored",
      reason: "Document not found in Sanity.",
    };
  }

  const documentType = typeof doc._type === "string" ? doc._type : "";
  const documentId = typeof doc._id === "string" ? doc._id : "";

  if (!isIndexableSanityType(documentType)) {
    return {
      ok: true,
      action: "ignored",
      documentId,
      documentType,
      reason: "Unsupported Sanity document type.",
    };
  }

  const extracted = extractRagDocument(doc);
  if (!extracted) {
    await deleteRagChunksForDocument(documentId);
    return {
      ok: true,
      action: "ignored",
      documentId,
      documentType,
      reason: "No indexable text found.",
    };
  }

  const chunks = chunkRagDocument(extracted);
  if (!chunks.length) {
    await deleteRagChunksForDocument(extracted.documentId);
    return {
      ok: true,
      action: "ignored",
      documentId: extracted.documentId,
      documentType: extracted.documentType,
      reason: "No chunks generated.",
    };
  }

  await connectMongo();
  await RagChunk.deleteMany({ documentId: extracted.documentId });

  const rows = [];
  for (const chunk of chunks) {
    const embedding = await embedText(chunk.chunkText);
    rows.push({
      ...chunk,
      embedding,
      source: "sanity",
      metadata: {
        ...chunk.metadata,
        embeddingModel: RAG_EMBEDDING_MODEL,
        embeddingDimensions: RAG_EMBEDDING_DIMENSIONS,
      },
    });
  }

  await RagChunk.insertMany(rows, { ordered: false });

  return {
    ok: true,
    action: "synced",
    documentId: extracted.documentId,
    documentType: extracted.documentType,
    chunks: rows.length,
  };
}

export async function reindexAllSanityDocuments(): Promise<{
  ok: true;
  totalDocuments: number;
  synced: number;
  ignored: number;
  chunks: number;
  results: RagSyncResult[];
}> {
  const docs = await fetchAllIndexableSanityDocuments();
  const results: RagSyncResult[] = [];
  let synced = 0;
  let ignored = 0;
  let chunks = 0;

  for (const doc of docs) {
    const result = await syncSanityDocumentToRag(doc);
    results.push(result);
    if (result.action === "synced") {
      synced += 1;
      chunks += result.chunks ?? 0;
    } else {
      ignored += 1;
    }
  }

  return {
    ok: true,
    totalDocuments: docs.length,
    synced,
    ignored,
    chunks,
    results,
  };
}
