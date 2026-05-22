import mongoose, { Schema, Document } from "mongoose";

export interface IModerationFlag extends Document {
  userEmail?: string;
  ipAddress?: string;
  reason: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModerationFlagSchema = new Schema<IModerationFlag>(
  {
    userEmail: { type: String },
    ipAddress: { type: String },
    reason: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ModerationFlag =
  (mongoose.models.ModerationFlag as mongoose.Model<IModerationFlag>) ||
  mongoose.model<IModerationFlag>("ModerationFlag", ModerationFlagSchema);
