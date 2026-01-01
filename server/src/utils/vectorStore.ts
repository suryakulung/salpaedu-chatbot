import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import KnowledgeChunk from '../models/KnowledgeChunk';

let vectorStore: MemoryVectorStore | null = null;

export const getVectorStore = async (): Promise<MemoryVectorStore> => {
    if (vectorStore) {
        return vectorStore;
    }

    // Initialize from MongoDB on first call
    const chunks = await KnowledgeChunk.find({});
    const docs = chunks.map(chunk => ({
        pageContent: chunk.content,
        metadata: { id: chunk._id, ...chunk.metadata }
    }));

    if (docs.length === 0) {
        // Return empty store if no docs
        vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
        return vectorStore;
    }

    vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
    );

    console.log(`Vector Store initialized with ${docs.length} documents.`);
    return vectorStore;
};

export const refreshVectorStore = async () => {
    vectorStore = null;
    await getVectorStore();
};
