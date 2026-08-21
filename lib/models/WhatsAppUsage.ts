import mongoose from "mongoose";

const WhatsAppUsageSchema = new mongoose.Schema(
  {
    monthYear: { type: String, required: true }, // Format: "YYYY-MM"
    messageCount: { type: Number, default: 0 },
    lastAlertSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent re-compilation in development
export const WhatsAppUsage =
  mongoose.models.WhatsAppUsage || mongoose.model("WhatsAppUsage", WhatsAppUsageSchema);
