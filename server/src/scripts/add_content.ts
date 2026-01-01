import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ingestText } from '../services/IngestionService';

dotenv.config();

const addSpecificContent = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-chatbot';
        await mongoose.connect(mongoURI);

        const text = "Salpa Consultancy is a leading educational consultant for abroad study to south korea, japan, china and uk, the consultancy is located at chabahil 07 kathmandu nepal";

        await ingestText(text, 'user-provided');
        console.log('Successfully added content.');
        process.exit(0);
    } catch (error) {
        console.error('Error adding content:', error);
        process.exit(1);
    }
};

addSpecificContent();
