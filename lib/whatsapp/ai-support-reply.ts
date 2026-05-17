import { generateClassgridRagAnswer } from "@/lib/ai/rag-answer";
import { getWhatsAppConversationHistory } from "@/lib/whatsapp/conversation-memory";

const MAX_USER_CHARS = 2000;

/**
 * Shared Classgrid RAG + Groq support reply for WhatsApp.
 * Returns null on failure so callers can keep the FAQ/default fallback behavior.
 */
export async function tryWhatsAppAiReply(
  userText: string,
  options: { phone?: string } = {}
): Promise<string | null> {
  const trimmed = userText.trim();
  if (!trimmed) return null;

  try {
    const history = await getWhatsAppConversationHistory(options.phone);
    const result = await generateClassgridRagAnswer({
      question: trimmed.slice(0, MAX_USER_CHARS),
      channel: "whatsapp",
      history,
    });

    return result.answer;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp-rag]", message);
    return null;
  }
}
