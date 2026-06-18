import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IForumUser extends Document {
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  provider: string; // 'google' | 'github' | 'linkedin' | 'email'
  isPlatformUser: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

const ForumUserSchema: Schema<IForumUser> = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  username: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  provider: { type: String, required: true },
  isPlatformUser: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.ForumUser as Model<IForumUser>) ||
  mongoose.model<IForumUser>('ForumUser', ForumUserSchema);
