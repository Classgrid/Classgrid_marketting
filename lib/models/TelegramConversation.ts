import mongoose, { Document, Model, Schema } from "mongoose";

export type TelegramConversationRole = "user" | "assistant";

export type TelegramConversationMessage = {
  role: TelegramConversationRole;
  content: string;
  messageId?: string;
  createdAt: Date;
};

export interface ITelegramConversation extends Document {
  chatId: string;
  messages: TelegramConversationMessage[];
  sessionContext?: Record<string, unknown>;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TelegramConversationMessageSchema = new Schema<TelegramConversationMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    messageId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TelegramConversationSchema = new Schema<ITelegramConversation>(
  {
    chatId: { type: String, required: true, unique: true, index: true },
    messages: { type: [TelegramConversationMessageSchema], default: [] },
    sessionContext: { type: Schema.Types.Mixed },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const TelegramConversation =
  (mongoose.models.TelegramConversation as Model<ITelegramConversation>) ||
  mongoose.model<ITelegramConversation>("TelegramConversation", TelegramConversationSchema);
