import mongoose, { Document, Schema } from 'mongoose';

export interface IWinner extends Document {
  photoId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  position: number;
  totalScore: number;
  announcement?: string;
  createdAt: Date;
  updatedAt: Date;
}

const winnerSchema = new Schema<IWinner>(
  {
    photoId: {
      type: Schema.Types.ObjectId,
      ref: 'Photo',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    position: {
      type: Number,
      required: true,
      min: 1,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    announcement: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique winner position per category
winnerSchema.index({ categoryId: 1, position: 1 }, { unique: true });

export default mongoose.model<IWinner>('Winner', winnerSchema);
