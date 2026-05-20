import mongoose, { Schema, Document } from "mongoose";

export interface IDemoRequest extends Document {
  institutionName: string;
  orgType: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  state: string;
  city: string;
  message?: string;
  status: "pending" | "contacted" | "demo_scheduled" | "rejected";
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
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "contacted", "demo_scheduled", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const DemoRequest =
  mongoose.models.DemoRequest ||
  mongoose.model<IDemoRequest>("DemoRequest", DemoRequestSchema);
