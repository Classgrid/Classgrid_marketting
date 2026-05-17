import { NextResponse } from "next/server";
import { verifyMetaAppSignature } from "@/lib/whatsapp/verify-app-signature";
import { processWhatsAppWebhookPayload } from "@/lib/whatsapp/process-webhook-payload";

export const dynamic = "force-dynamic";

/**
 * Meta Cloud API webhook verification (GET) and inbound events (POST).
 * Configure callback URL: `{NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp`
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token")?.trim();
  const challenge = url.searchParams.get("hub.challenge");

  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN?.trim();
  if (!expected) {
    console.error("Missing WHATSAPP_WEBHOOK_VERIFY_TOKEN");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  if (mode === "subscribe" && token === expected && challenge != null && challenge !== "") {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (appSecret) {
    const sig = req.headers.get("x-hub-signature-256");
    if (!verifyMetaAppSignature(rawBody, sig, appSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("Missing WHATSAPP_APP_SECRET in production — rejecting webhook");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  } else {
    console.warn("[whatsapp] WHATSAPP_APP_SECRET not set — skipping signature verification (dev only)");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await processWhatsAppWebhookPayload(payload as Parameters<typeof processWhatsAppWebhookPayload>[0]);
  } catch (e) {
    console.error("[whatsapp] webhook handler error", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
