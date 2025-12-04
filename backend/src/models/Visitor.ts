import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    name: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVisitor>('Visitor', visitorSchema);
