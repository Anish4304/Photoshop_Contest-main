import mongoose, { Document, Schema } from 'mongoose';

export interface IJudge extends Document {
  name: string;
  email: string;
  password: string;
  expertise?: string;
  role: 'judge';
  createdAt: Date;
  updatedAt: Date;
}

const judgeSchema = new Schema<IJudge>(
  {
    name: {
      type: String,
      required: [true, 'Judge name is required'],
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
    expertise: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: 'judge',
      enum: ['judge'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJudge>('Judge', judgeSchema);
