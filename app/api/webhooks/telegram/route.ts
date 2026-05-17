import { NextResponse } from "next/server";
import { handleInboundTelegramMessage } from "@/lib/telegram/handle-inbound";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Verify Secret Token
  // Telegram passes the secret token in the x-telegram-bot-api-secret-token header
  const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
  const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (expectedToken && secretToken !== expectedToken) {
    console.error("[telegram] Webhook secret token mismatch");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Parse payload
  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Handle message asynchronously (do not block the webhook response)
  // Telegram expects a quick 200 OK. We'll await it here because Vercel/Next.js edge functions
  // might kill the process if we return before promises resolve. In a true background queue,
  // we would offload this. Since groq is fast (1-2s), awaiting is usually fine for Telegram.
  try {
    await handleInboundTelegramMessage(payload);
  } catch (e) {
    console.error("[telegram] Webhook handler error", e);
    // Still return 200 so Telegram doesn't aggressively retry on our internal errors
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return new NextResponse("Telegram webhook endpoint is active.", { status: 200 });
}
