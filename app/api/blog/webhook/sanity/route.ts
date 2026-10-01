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

    //    Only queue the email if the author explicitly turned the toggle ON
    //    We MUST use a fresh client with useCdn: false, otherwise the CDN 
    //    might return a cached version where the toggle is still OFF!
    const { createClient } = await import("@sanity/client");
    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-05-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    const fullDoc = await writeClient.fetch(
      `*[_id == $docId || _id == "drafts." + $docId][0]{ sendSubscriberNotification, postToFacebook, postToInstagram, "coverUrl": coverImage.asset->url, "ogUrl": ogImage.asset->url }`,
      { docId: documentId }
    );

    const hasEmail = !!fullDoc?.sendSubscriberNotification;
    const hasFb = !!fullDoc?.postToFacebook;
    const hasIg = !!fullDoc?.postToInstagram;

    if (!hasEmail && !hasFb && !hasIg) {
      console.log(`⏭️ Webhook received for "${slug}" but ALL toggles are OFF. Skipping.`);
      return NextResponse.json(
        { message: "Webhook received but all toggles are OFF. Skipping." },
        { status: 202 }
      );
    }

    // 5. Extract a displayable title
    const title = getLocalizedString(payload.title, "Untitled");

    // 6. Insert into the queue (ONLY if Email toggle is ON)
    if (hasEmail) {
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
    }

    // 7. Reset the toggles so they don't fire again on next publish
    try {
      // Give Sanity Studio UI 2 seconds to finish its "Publishing..." animation 
      // before we mutate the document behind its back, which avoids the UI freezing.
      await new Promise(r => setTimeout(r, 2000));

      const resetData: any = {};
      if (hasEmail) resetData.sendSubscriberNotification = false;
      if (hasFb) resetData.postToFacebook = false;
      if (hasIg) resetData.postToInstagram = false;

      await writeClient.patch(documentId).set(resetData).commit();
      console.log(`🔄 Reset toggles for "${slug}"`);
    } catch (resetErr) {
      console.warn("⚠️ Could not reset notification toggles:", resetErr);
    }

    // 8. Process Meta Social Posts (Facebook / Instagram)
    if (hasFb || hasIg) {
      const postUrl = `https://classgrid.in/${documentType === 'post' ? 'blog' : 'changelog'}/${slug}`;
      const messageText = `New Update from Classgrid! ${title}\n\nRead more at: ${postUrl}`;
      const token = process.env.META_ACCESS_TOKEN;
      const imageUrl = fullDoc?.coverUrl || fullDoc?.ogUrl || "";

      if (token) {
        // Facebook
        if (hasFb && process.env.META_FACEBOOK_PAGE_ID) {
          try {
            console.log("Posting to Facebook...");
            const endpoint = imageUrl ? 'photos' : 'feed';
            const bodyPayload: any = { access_token: token, message: messageText };
            if (imageUrl) bodyPayload.url = imageUrl;
            
            await fetch(`https://graph.facebook.com/v19.0/${process.env.META_FACEBOOK_PAGE_ID}/${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyPayload)
            });
          } catch (err) {
            console.error("Facebook post failed", err);
          }
        }
        
        // Instagram
        if (hasIg && process.env.META_INSTAGRAM_ACCOUNT_ID) {
          if (imageUrl) {
            try {
              console.log("Posting to Instagram...");
              const createRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.META_INSTAGRAM_ACCOUNT_ID}/media`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token: token, image_url: imageUrl, caption: messageText })
              });
              const createData = await createRes.json();
              
              if (createData.id) {
                await fetch(`https://graph.facebook.com/v19.0/${process.env.META_INSTAGRAM_ACCOUNT_ID}/media_publish`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ access_token: token, creation_id: createData.id })
                });
              } else {
                console.error("Instagram post creation failed", createData);
              }
            } catch (err) {
              console.error("Instagram post failed", err);
            }
          } else {
            console.warn("Skipping Instagram post: No coverImage or ogImage found in the document.");
          }
        }
      } else {
        console.warn("META_ACCESS_TOKEN missing in .env! Skipping social post.");
      }
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
