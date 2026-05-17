import { connectMongo } from "@/lib/mongodb";
import {
  TelegramConversation,
  type TelegramConversationMessage,
  type TelegramConversationRole,
} from "@/lib/models/TelegramConversation";
import type { ChatHistoryItem } from "@/lib/ai/rag-answer";

const MAX_STORED_MESSAGES = 40;
const MAX_HISTORY_MESSAGES = 10;

function cleanContent(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 2000);
}

export async function appendTelegramConversationMessage(params: {
  chatId: string;
  role: TelegramConversationRole;
  content: string;
  messageId?: string;
}) {
  const content = cleanContent(params.content);
  if (!params.chatId || !content) return;

  const message: TelegramConversationMessage = {
    role: params.role,
    content,
    messageId: params.messageId,
    createdAt: new Date(),
  };

  await connectMongo();
  await TelegramConversation.updateOne(
    { chatId: params.chatId },
    {
      $push: {
        messages: {
          $each: [message],
          $slice: -MAX_STORED_MESSAGES,
        },
      },
      $set: { lastMessageAt: new Date() },
      $setOnInsert: { chatId: params.chatId },
    },
    { upsert: true }
  );
}

export async function getTelegramConversationHistory(chatId?: string): Promise<ChatHistoryItem[]> {
  if (!chatId) return [];

  await connectMongo();
  const conversation = await TelegramConversation.findOne({ chatId })
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
