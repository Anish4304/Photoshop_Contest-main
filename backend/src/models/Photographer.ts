import mongoose, { Document, Schema } from 'mongoose';

export interface IPhotographer extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  role: 'photographer';
  createdAt: Date;
  updatedAt: Date;
}

const photographerSchema = new Schema<IPhotographer>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: 'photographer',
      enum: ['photographer'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPhotographer>('Photographer', photographerSchema);
