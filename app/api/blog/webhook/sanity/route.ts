import crypto from "crypto";
import { NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

import { supabaseAdmin } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────
type WebhookPayload = {
  _id?: string;
  _type?: string;
  title?: string | { en?: string; hi?: string; mr?: string };
  slug?: string | { current?: string };
  documentId?: string;
  result?: {
    _id?: string;
    _type?: string;
    slug?: string | { current?: string };
  };
  ids?: {
    created?: string[];
    updated?: string[];
  };
  updateType?: string;
  releaseDate?: string;
  versionLabel?: string;
};

type NotificationDocumentType = "post" | "changelogEntry" | "legalPage";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function resolveSlug(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "current" in value) {
    const current = (value as { current?: unknown }).current;
    return typeof current === "string" ? current : null;
  }
  return null;
}

function getLocalizedString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value || fallback;
  if (value && typeof value === "object") {
    const loc = value as { en?: unknown; hi?: unknown; mr?: unknown };
    if (typeof loc.en === "string" && loc.en) return loc.en;
    if (typeof loc.hi === "string" && loc.hi) return loc.hi;
    if (typeof loc.mr === "string" && loc.mr) return loc.mr;
  }
  return fallback;
}

function resolveDocumentType(payload: WebhookPayload): NotificationDocumentType | null {
  const rawType = payload._type || payload.result?._type;
  if (rawType === "post" || rawType === "changelogEntry" || rawType === "legalPage") return rawType;
  if (payload.updateType || payload.releaseDate || payload.versionLabel) return "changelogEntry";
  if (payload.slug || payload.title || payload._id || payload.documentId) return "post";
  return null;
}

function resolveDocumentId(payload: WebhookPayload): string | null {
  const directId = payload._id || payload.documentId || payload.result?._id;
  if (typeof directId === "string" && directId.trim()) return directId;
  const derivedId = payload.ids?.created?.[0] || payload.ids?.updated?.[0];
  return typeof derivedId === "string" && derivedId.trim() ? derivedId : null;
}

// ─── POST handler ────────────────────────────────────────────────────────────
// This webhook ONLY inserts into the queue table.
// The actual email sending is handled by the cron job at /api/cron/send-notifications
export async function POST(req: Request) {
  try {
    // 1. Read raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get(SIGNATURE_HEADER_NAME) || "";
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Missing SANITY_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // 2. Verify Sanity signature
    if (!isValidSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse the payload
    const payload = JSON.parse(body) as WebhookPayload;
    const documentType = resolveDocumentType(payload);
    const documentId = resolveDocumentId(payload);
    const slug = resolveSlug(payload.slug) || resolveSlug(payload.result?.slug);

    if (!documentType || !documentId) {
      return NextResponse.json(
        { message: "Webhook ignored: unsupported or incomplete payload." },
        { status: 202 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "Webhook ignored: no slug found." },
        { status: 202 }
      );
    }

    // 4. Check if sendSubscriberNotification is enabled
    //    Only queue the email if the author explicitly turned the toggle ON
    const { client: sanityWriteClient } = await import("@/sanity/lib/client");
    const fullDoc = await sanityWriteClient.fetch(
      `*[_id == $docId || _id == "drafts." + $docId][0]{ sendSubscriberNotification }`,
      { docId: documentId }
    );

    if (!fullDoc?.sendSubscriberNotification) {
      console.log(`⏭️ Webhook received for "${slug}" but sendSubscriberNotification is OFF. Skipping.`);
      return NextResponse.json(
        { message: "Webhook received but notification toggle is OFF. No email queued." },
        { status: 202 }
      );
    }

    // 5. Extract a displayable title
    const title = getLocalizedString(payload.title, "Untitled");

    // 6. Insert into the queue (upsert to handle duplicate webhook fires)
    const { error: queueError } = await supabaseAdmin
      .from("email_notification_queue")
      .upsert(
        {
          document_type: documentType,
          document_id: documentId,
          slug,
          title,
          status: "pending",
          retry_count: 0,
          error_message: null,
          created_at: new Date().toISOString(),
        },
        { onConflict: "document_id" }
      );

    if (queueError) {
      console.error("Queue insert error:", queueError);
      return NextResponse.json({ error: "Failed to queue notification" }, { status: 500 });
    }

    // 7. Reset the toggle so it doesn't fire again on next publish
    try {
      const { createClient } = await import("@sanity/client");
      const writeClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5",
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: "2026-05-01",
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
      });
      await writeClient.patch(documentId).set({ sendSubscriberNotification: false }).commit();
      console.log(`🔄 Reset sendSubscriberNotification for "${slug}"`);
    } catch (resetErr) {
      console.warn("⚠️ Could not reset notification toggle:", resetErr);
    }

    console.log(`📬 Queued ${documentType} notification: "${title}" (${slug})`);

    return NextResponse.json(
      {
        message: "Notification queued successfully. Will be sent on next cron cycle.",
        documentType,
        documentId,
        slug,
        title,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
