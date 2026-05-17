import { NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

import {
  deleteRagChunksForDocument,
  reindexAllSanityDocuments,
  syncSanityDocumentToRag,
  type RagSyncResult,
} from "@/lib/ai/rag-sync";
import { reindexPlatformKnowledge } from "@/lib/ai/platform-knowledge";
import { isIndexableSanityType, normalizeText } from "@/lib/ai/rag-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SanitySyncPayload = {
  _id?: string;
  _type?: string;
  documentId?: string;
  operation?: string;
  transition?: string;
  mode?: string;
  ids?: {
    created?: string[];
    updated?: string[];
    deleted?: string[];
    all?: string[];
  };
  result?: {
    _id?: string;
    _type?: string;
  };
};

function bearerToken(authHeader: string | null) {
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

function isAuthorized(req: Request, rawBody: string) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) || "";
  const sanitySecret = process.env.SANITY_WEBHOOK_SECRET;

  if (sanitySecret && signature && isValidSignature(rawBody, signature, sanitySecret)) {
    return true;
  }

  const syncSecret = process.env.RAG_SYNC_SECRET || sanitySecret;
  const headerSecret =
    req.headers.get("x-classgrid-rag-secret") ||
    req.headers.get("x-rag-sync-secret") ||
    bearerToken(req.headers.get("authorization"));

  if (syncSecret && headerSecret && headerSecret === syncSecret) {
    return true;
  }

  return process.env.NODE_ENV !== "production" && !syncSecret;
}

function unique(values: Array<string | undefined | null>) {
  return Array.from(new Set(values.map((value) => normalizeText(value)).filter(Boolean)));
}

function payloadOperation(payload: SanitySyncPayload) {
  return normalizeText(payload.operation || payload.transition).toLowerCase();
}

function deletedIds(payload: SanitySyncPayload) {
  const operation = payloadOperation(payload);
  const directId = payload._id || payload.documentId || payload.result?._id;

  if (operation.includes("delete")) {
    return unique([directId, ...(payload.ids?.deleted || [])]);
  }

  return unique(payload.ids?.deleted || []);
}

function upsertIds(payload: SanitySyncPayload) {
  const operation = payloadOperation(payload);
  if (operation.includes("delete")) return [];

  return unique([
    payload._id,
    payload.documentId,
    payload.result?._id,
    ...(payload.ids?.created || []),
    ...(payload.ids?.updated || []),
    ...(payload.ids?.all || []),
  ]);
}

function hasInlineDocument(payload: SanitySyncPayload) {
  return Boolean(payload._id && payload._type && isIndexableSanityType(payload._type));
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    if (!isAuthorized(req, rawBody)) {
      return NextResponse.json({ error: "Invalid or missing sync signature." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody || "{}") as SanitySyncPayload;

    if (payload.mode === "reindexAll") {
      const sanity = await reindexAllSanityDocuments();
      const platform = await reindexPlatformKnowledge();

      return NextResponse.json(
        {
          ok: true,
          totalDocuments: sanity.totalDocuments + platform.totalDocuments,
          synced: sanity.synced + platform.synced,
          ignored: sanity.ignored + platform.ignored,
          chunks: sanity.chunks + platform.chunks,
          sanity,
          platform,
        },
        { status: 200 }
      );
    }

    if (payload.mode === "reindexPlatform") {
      const platform = await reindexPlatformKnowledge();
      return NextResponse.json(platform, { status: 200 });
    }

    const results: RagSyncResult[] = [];

    for (const id of deletedIds(payload)) {
      results.push(await deleteRagChunksForDocument(id));
    }

    const idsToUpsert = upsertIds(payload);
    if (idsToUpsert.length > 0) {
      for (const id of idsToUpsert) {
        results.push(await syncSanityDocumentToRag(id));
      }
    } else if (hasInlineDocument(payload) && !payloadOperation(payload).includes("delete")) {
      results.push(await syncSanityDocumentToRag(payload as Record<string, unknown>));
    }

    if (!results.length) {
      return NextResponse.json(
        {
          ok: true,
          action: "ignored",
          reason: "No document IDs or indexable inline document found.",
        },
        { status: 202 }
      );
    }

    const synced = results.filter((result) => result.action === "synced").length;
    const deleted = results.filter((result) => result.action === "deleted").length;
    const ignored = results.filter((result) => result.action === "ignored").length;
    const chunks = results.reduce((sum, result) => sum + (result.chunks || 0), 0);

    return NextResponse.json(
      {
        ok: true,
        synced,
        deleted,
        ignored,
        chunks,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[rag-sync] Error syncing embeddings:", error);
    return NextResponse.json({ ok: false, error: "Failed to sync RAG embeddings." }, { status: 500 });
  }
}
