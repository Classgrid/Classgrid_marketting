import mongoose, { Schema, Document } from "mongoose";

export interface IAiRateLimit extends Document {
  identifier: string; // User email or IP address
  count: number;
  expireAt: Date;
}

const AiRateLimitSchema = new Schema<IAiRateLimit>(
  {
    identifier: { type: String, required: true, index: true },
    count: { type: Number, required: true, default: 1 },
    expireAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Automatically delete the document when the expireAt time is reached
AiRateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const AiRateLimit =
  (mongoose.models.AiRateLimit as mongoose.Model<IAiRateLimit>) ||
  mongoose.model<IAiRateLimit>("AiRateLimit", AiRateLimitSchema);
