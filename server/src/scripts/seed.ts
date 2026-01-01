import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ingestHtmlContent } from '../services/IngestionService';

dotenv.config();

const seed = async () => {
    try {
        // Connect DB
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-chatbot';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');

        // Read index.html
        // Path relative to execution: server/src/scripts -> project root
        // Assuming run from server root: ../../index.html
        const indexPath = path.join(__dirname, '../../../../index.html');

        console.log(`Reading from ${indexPath}...`);

        if (!fs.existsSync(indexPath)) {
            console.error('index.html not found!');
            process.exit(1);
        }

        const html = fs.readFileSync(indexPath, 'utf-8');

        console.log('Ingesting content...');
        const count = await ingestHtmlContent(html, 'website-home');

        console.log(`Successfully ingested ${count} chunks.`);
        process.exit(0);

    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seed();
