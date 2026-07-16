import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  userId: string;       // references User._id from auth-service
  fileName: string;
  content: string;      // the raw code string (not the rendered image)
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    userId:   { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    content:  { type: String, default: '' },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  }
);

export default mongoose.model<IFile>('File', FileSchema);
