import { connectMongo } from "@/lib/mongodb";
import WhatsAppOTP from "@/lib/models/WhatsAppOTP";
import { checkRateLimit } from "@/lib/rate-limit";
import { appendWhatsAppConversationMessage } from "@/lib/whatsapp/conversation-memory";
import { resolveSupportReply } from "@/lib/whatsapp/resolve-support-reply";
import { sendWhatsAppText } from "@/lib/whatsapp/cloud-api";

export type WaInboundText = {
  from: string;
  messageId: string;
  body: string;
};

function wantsOtpTest(body: string): boolean {
  const t = body.trim().toLowerCase();
  if (t === "otp" || t === "otp test" || t === "test otp") return true;
  if (t.startsWith("otp ") && t.length <= 32) return true;
  return false;
}

async function issuePlaintextOtpReply(phone: string): Promise<string> {
  const allowed = process.env.WHATSAPP_ALLOW_PLAINTEXT_OTP_REPLY === "true";
  if (!allowed) {
    return [
      "OTP over plain chat is disabled in this environment.",
      "Ask your admin to enable WHATSAPP_ALLOW_PLAINTEXT_OTP_REPLY for sandbox testing,",
      "or use an approved *authentication* template from Meta (see ClassGrid server docs).",
    ].join("\n");
  }

  const rateKey = `wa_otp_${phone}`;
  const ok = checkRateLimit(rateKey, 5, 60 * 60 * 1000);
  if (!ok) {
    return "Too many OTP requests from this number. Please try again in about an hour.";
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await connectMongo();
  await WhatsAppOTP.updateOne(
    { phone },
    { $set: { otp, expiresAt, attempts: 0 } },
    { upsert: true }
  );

  return [
    `Your ClassGrid *test* code is *${otp}*.`,
    "It expires in 5 minutes. Do not share this code with anyone.",
    "",
    "_Sandbox only — production should use Meta authentication templates._",
  ].join("\n");
}

/** @returns true if Graph API accepted the outbound message */
export async function handleInboundTextMessage(msg: WaInboundText): Promise<boolean> {
  const body = msg.body || "";
  let reply: string;

  if (wantsOtpTest(body)) {
    reply = await issuePlaintextOtpReply(msg.from);
  } else {
    await appendWhatsAppConversationMessage({
      phone: msg.from,
      role: "user",
      content: body,
      messageId: msg.messageId,
    });
    reply = await resolveSupportReply(body, { phone: msg.from });
  }

  const result = await sendWhatsAppText({ toE164: msg.from, body: reply });
  if (result.ok === false) {
    console.error("[whatsapp] send failed", { to: msg.from, error: result.error, messageId: msg.messageId });
    return false;
  }
  await appendWhatsAppConversationMessage({
    phone: msg.from,
    role: "assistant",
    content: reply,
    messageId: `${msg.messageId}:reply`,
  });
  return true;
}
