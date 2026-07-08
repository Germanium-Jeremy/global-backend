import mongoose, { Schema, Document } from 'mongoose';
import { Role } from 'shared';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  // Optional profile fields
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.Guest },
  createdAt: { type: Date, default: Date.now },
  // Optional profile fields — populated only when provided by the client
  username: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  avatarUrl: { type: String, required: false },
});

export default mongoose.model<IUser>('User', UserSchema);
