import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { getVectorStore } from '../utils/vectorStore';
import ChatSession, { IMessage } from '../models/ChatSession';

const SYSTEM_TEMPLATE = `You are a helpful AI assistant for a website. 
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
If the user asks to speak to a human or if you are unsure, suggest they contact support at info@salpaedu.com.

Context:
{context}

Chat History:
{chat_history}

Question: {question}
Helpful Answer:`;

export const getSmartResponse = async (message: string, sessionId: string, history: IMessage[]): Promise<string> => {
    const vectorStore = await getVectorStore();
    const retriever = vectorStore.asRetriever(3); // Top 3 docs

    const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0.3, // Low temp for factual answers
    });

    const prompt = PromptTemplate.fromTemplate(SYSTEM_TEMPLATE);

    // Format history
    const historyText = history.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');

    const chain = RunnableSequence.from([
        {
            context: async (input: any) => {
                const docs = await retriever.getRelevantDocuments(input.question);
                return docs.map(d => d.pageContent).join('\n\n');
            },
            question: (input: any) => input.question,
            chat_history: (input: any) => input.chat_history,
        },
        prompt,
        model,
        new StringOutputParser(),
    ]);

    const response = await chain.invoke({
        question: message,
        chat_history: historyText
    });

    return response;
};

export const saveMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
        session = new ChatSession({ sessionId, messages: [] });
    }
    session.messages.push({ role, content, timestamp: new Date() });
    await session.save();
    return session;
};
