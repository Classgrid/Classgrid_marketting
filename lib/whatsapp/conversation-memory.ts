import { connectMongo } from "@/lib/mongodb";
import {
  WhatsAppConversation,
  type WhatsAppConversationMessage,
  type WhatsAppConversationRole,
} from "@/lib/models/WhatsAppConversation";
import type { ChatHistoryItem } from "@/lib/ai/rag-answer";

const MAX_STORED_MESSAGES = 40;
const MAX_HISTORY_MESSAGES = 10;

function cleanContent(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 2000);
}

export async function appendWhatsAppConversationMessage(params: {
  phone: string;
  role: WhatsAppConversationRole;
  content: string;
  messageId?: string;
}) {
  const content = cleanContent(params.content);
  if (!params.phone || !content) return;

  const message: WhatsAppConversationMessage = {
    role: params.role,
    content,
    messageId: params.messageId,
    createdAt: new Date(),
  };

  await connectMongo();
  await WhatsAppConversation.updateOne(
    { phone: params.phone },
    {
      $push: {
        messages: {
          $each: [message],
          $slice: -MAX_STORED_MESSAGES,
        },
      },
      $set: { lastMessageAt: new Date() },
      $setOnInsert: { phone: params.phone },
    },
    { upsert: true }
  );
}

export async function getWhatsAppConversationHistory(phone?: string): Promise<ChatHistoryItem[]> {
  if (!phone) return [];

  await connectMongo();
  const conversation = await WhatsAppConversation.findOne({ phone })
    .select({ messages: 1 })
    .lean();

  const messages = Array.isArray(conversation?.messages) ? conversation.messages : [];
  return messages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
    .filter((message) => message.role === "user" || message.role === "assistant");
}
