import mongoose, { Document, Model, Schema } from "mongoose";

export type EmailConversationRole = "user" | "assistant";

export type EmailConversationMessage = {
  role: EmailConversationRole;
  content: string;
  messageId?: string;     // Email Message-ID header (for threading)
  zohoMessageId?: string; // Zoho's internal message ID
  subject?: string;       // Subject line (for first message)
  createdAt: Date;
};

export interface IEmailConversation extends Document {
  senderEmail: string;
  senderName: string;
  threadId: string;                    // First Message-ID or Zoho thread ID
  subject: string;                     // Original email subject
  messages: EmailConversationMessage[];
  status: "active" | "escalated" | "resolved" | "closed";
  escalatedTicketId?: string;          // Platform ticket ID if escalated
  sessionContext?: Record<string, unknown>;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailConversationMessageSchema = new Schema<EmailConversationMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    messageId: { type: String },
    zohoMessageId: { type: String },
    subject: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EmailConversationSchema = new Schema<IEmailConversation>(
  {
    senderEmail: { type: String, required: true, index: true },
    senderName: { type: String, default: "" },
    threadId: { type: String, required: true, index: true },
    subject: { type: String, default: "" },
    messages: { type: [EmailConversationMessageSchema], default: [] },
    status: {
      type: String,
      enum: ["active", "escalated", "resolved", "closed"],
      default: "active",
      index: true,
    },
    escalatedTicketId: { type: String },
    sessionContext: { type: Schema.Types.Mixed },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Compound index: lookup by sender email + thread
EmailConversationSchema.index({ senderEmail: 1, threadId: 1 }, { unique: true });

export const EmailConversation =
  (mongoose.models.EmailConversation as Model<IEmailConversation>) ||
  mongoose.model<IEmailConversation>("EmailConversation", EmailConversationSchema);
