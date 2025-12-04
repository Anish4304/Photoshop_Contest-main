import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  name: string;
  description?: string;
  photos: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    name: {
      type: String,
      required: [true, 'Gallery name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGallery>('Gallery', gallerySchema);
