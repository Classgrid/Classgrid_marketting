import mongoose, { Document, Model, Schema } from "mongoose";

export type WhatsAppConversationRole = "user" | "assistant";

export type WhatsAppConversationMessage = {
  role: WhatsAppConversationRole;
  content: string;
  messageId?: string;
  createdAt: Date;
};

export interface IWhatsAppConversation extends Document {
  phone: string;
  messages: WhatsAppConversationMessage[];
  sessionContext?: Record<string, unknown>;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppConversationMessageSchema = new Schema<WhatsAppConversationMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    messageId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WhatsAppConversationSchema = new Schema<IWhatsAppConversation>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    messages: { type: [WhatsAppConversationMessageSchema], default: [] },
    sessionContext: { type: Schema.Types.Mixed },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const WhatsAppConversation =
  (mongoose.models.WhatsAppConversation as Model<IWhatsAppConversation>) ||
  mongoose.model<IWhatsAppConversation>("WhatsAppConversation", WhatsAppConversationSchema);
