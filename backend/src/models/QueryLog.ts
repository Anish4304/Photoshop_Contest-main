import mongoose, { Document, Schema } from 'mongoose';

export interface IQueryLog extends Document {
  queryId: number;
  queryTitle: string;
  endpoint: string;
  results: any[];
  executedAt: Date;
}

const queryLogSchema = new Schema<IQueryLog>(
  {
    queryId: { type: Number, required: true },
    queryTitle: { type: String, required: true },
    endpoint: { type: String, required: true },
    results: { type: Schema.Types.Mixed, required: true },
    executedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IQueryLog>('QueryLog', queryLogSchema);
