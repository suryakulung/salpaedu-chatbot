import * as cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import KnowledgeChunk from '../models/KnowledgeChunk';
import { refreshVectorStore } from '../utils/vectorStore';

export const ingestHtmlContent = async (htmlContent: string, source: string) => {
    const $ = cheerio.load(htmlContent);
    // Remove scripts and styles
    $('script').remove();
    $('style').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([text]);

    // Save to MongoDB
    for (const doc of output) {
        await KnowledgeChunk.create({
            content: doc.pageContent,
            metadata: { source, ...doc.metadata }
        });
    }

    // Refresh Vector Store
    await refreshVectorStore();
    return output.length;
};

export const ingestText = async (text: string, source: string) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([text]);

    for (const doc of output) {
        await KnowledgeChunk.create({
            content: doc.pageContent,
            metadata: { source, ...doc.metadata }
        });
    }

    await refreshVectorStore();
    return output.length;
};
