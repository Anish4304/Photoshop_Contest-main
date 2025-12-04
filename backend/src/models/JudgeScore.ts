import mongoose, { Document, Schema } from 'mongoose';

export interface IJudgeScore extends Document {
  judgeId: mongoose.Types.ObjectId;
  photoId: mongoose.Types.ObjectId;
  score: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const judgeScoreSchema = new Schema<IJudgeScore>(
  {
    judgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Judge',
      required: true,
    },
    photoId: {
      type: Schema.Types.ObjectId,
      ref: 'Photo',
      required: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: 0,
      max: 10,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a judge can only score a photo once
judgeScoreSchema.index({ judgeId: 1, photoId: 1 }, { unique: true });

export default mongoose.model<IJudgeScore>('JudgeScore', judgeScoreSchema);
