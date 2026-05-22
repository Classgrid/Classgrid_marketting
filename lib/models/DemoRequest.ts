import mongoose, { Schema, Document } from "mongoose";

export interface IDemoRequest extends Document {
  institutionName: string;
  orgType: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  state: string;
  city: string;
  role?: string;
  source?: string;
  message?: string;
  status: "pending" | "contacted" | "demo_scheduled" | "rejected";
  
  // Meeting Details
  provider?: string;
  scheduledAt?: string;
  meetingUrl?: string;
  timezone?: string;
  notes?: string;

  otp?: string;
  otpExpiresAt?: Date;
  isEmailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const DemoRequestSchema = new Schema<IDemoRequest>(
  {
    institutionName: { type: String, required: true },
    orgType: { type: String, required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminPhone: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String },
    source: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "contacted", "demo_scheduled", "rejected"],
      default: "pending",
    },
    provider: { type: String },
    scheduledAt: { type: String },
    meetingUrl: { type: String },
    timezone: { type: String },
    notes: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DemoRequest =
  (mongoose.models.DemoRequest as mongoose.Model<IDemoRequest>) ||
  mongoose.model<IDemoRequest>("DemoRequest", DemoRequestSchema);
