import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomInstruction extends Document {
  userId: string;
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomInstructionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    systemPrompt: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICustomInstruction>('CustomInstruction', CustomInstructionSchema);
