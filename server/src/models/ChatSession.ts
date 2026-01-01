import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface IChatSession extends Document {
    sessionId: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const ChatSessionSchema: Schema = new Schema({
    sessionId: { type: String, required: true, unique: true },
    messages: [
        {
            role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

export default mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
