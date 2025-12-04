import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitorVote extends Document {
  visitorId: mongoose.Types.ObjectId;
  photoId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const visitorVoteSchema = new Schema<IVisitorVote>(
  {
    visitorId: {
      type: Schema.Types.ObjectId,
      ref: 'Visitor',
      required: true,
    },
    photoId: {
      type: Schema.Types.ObjectId,
      ref: 'Photo',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a visitor can only vote once per photo
visitorVoteSchema.index({ visitorId: 1, photoId: 1 }, { unique: true });

export default mongoose.model<IVisitorVote>('VisitorVote', visitorVoteSchema);
