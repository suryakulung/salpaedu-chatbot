import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
    name?: string;
    email?: string;
    phone?: string;
    subjectInterest?: string;
    source: string;
    createdAt: Date;
}

const LeadSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    subjectInterest: { type: String },
    source: { type: String, default: 'chatbot' },
}, { timestamps: true });

export default mongoose.model<ILead>('Lead', LeadSchema);
