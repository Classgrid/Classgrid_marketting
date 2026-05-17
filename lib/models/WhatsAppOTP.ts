import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWhatsAppOTP extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const WhatsAppOTPSchema: Schema<IWhatsAppOTP> = new Schema({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

export default (mongoose.models.WhatsAppOTP as Model<IWhatsAppOTP>) ||
  mongoose.model<IWhatsAppOTP>("WhatsAppOTP", WhatsAppOTPSchema);
