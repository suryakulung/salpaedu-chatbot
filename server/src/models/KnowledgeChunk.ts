import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeChunk extends Document {
    content: string;
    metadata: Record<string, any>;
    vector?: number[]; // Depending on if we store vectors here or use Atlas Search
    createdAt: Date;
}

const KnowledgeChunkSchema: Schema = new Schema({
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    vector: { type: [Number], index: true }, // Simple vector storage
}, { timestamps: true });

export default mongoose.model<IKnowledgeChunk>('KnowledgeChunk', KnowledgeChunkSchema);
