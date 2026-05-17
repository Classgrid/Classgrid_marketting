import { tryWhatsAppAiReply } from "@/lib/whatsapp/ai-support-reply";
import { defaultSupportReply, matchFaqReply } from "@/lib/whatsapp/match-reply";

/** Whole message is basically just “hello” / “hi” (not “hello what is pricing”). */
const GREETING_ONLY =
  /^(hello|hi|hey|namaste|good\s+(morning|afternoon|evening)|hola)\b[!.,\s]*$/i;

function isGreetingOnly(text: string): boolean {
  const t = text.trim();
  return t.length > 0 && GREETING_ONLY.test(t);
}

function greetingReply(): string {
  return [
    "Hello! Thanks for messaging ClassGrid.",
    "",
    "Ask about *pricing*, *account*, *colleges*, *parents login*, or *what is ClassGrid* — or email support@classgrid.in.",
  ].join("\n");
}

/**
 * Single entry point for non-OTP inbound text: FAQ → optional AI → default.
 * WhatsApp webhook / future channels can share this.
 */
export async function resolveSupportReply(
  inboundBody: string,
  options: { phone?: string } = {}
): Promise<string> {
  const trimmed = inboundBody.trim();

  const faqHit = matchFaqReply(trimmed);
  if (faqHit) return faqHit;

  if (isGreetingOnly(trimmed)) return greetingReply();

  if (process.env.WHATSAPP_USE_AI_FALLBACK === "true") {
    const ai = await tryWhatsAppAiReply(trimmed, { phone: options.phone });
    if (ai) return ai;
  }

  return defaultSupportReply();
}
