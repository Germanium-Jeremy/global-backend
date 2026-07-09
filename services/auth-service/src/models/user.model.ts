import mongoose, { Schema, Document } from 'mongoose';
import { Role } from 'shared';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.Guest },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
