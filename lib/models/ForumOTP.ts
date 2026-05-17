import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IForumOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const ForumOTPSchema: Schema<IForumOTP> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 }
});

export default (mongoose.models.ForumOTP as Model<IForumOTP>) ||
  mongoose.model<IForumOTP>('ForumOTP', ForumOTPSchema);
