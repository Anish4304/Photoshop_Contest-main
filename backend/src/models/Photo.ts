import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  photographerId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  galleries: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const photoSchema = new Schema<IPhoto>(
  {
    title: {
      type: String,
      required: [true, 'Photo title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    galleries: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Gallery',
      },
    ],
  },
  {
    timestamps: true,
  }
);

photoSchema.index({ photographerId: 1, categoryId: 1 });

export default mongoose.model<IPhoto>('Photo', photoSchema);
