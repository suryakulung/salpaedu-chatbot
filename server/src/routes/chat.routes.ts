import express from 'express';
import { getSmartResponse, saveMessage } from '../services/AIService';
import { ingestHtmlContent } from '../services/IngestionService';
import ChatSession from '../models/ChatSession';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Chat Endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        // Ensure sessionId
        const finalSessionId = sessionId || uuidv4();

        // 1. Save User Message
        const session = await saveMessage(finalSessionId, 'user', message);

        // 2. Get AI Response
        const history = session.messages.slice(0, -1); // Exclude current message from history passed to LLM context to avoid duplication if logic changes, currently simplistic
        const reply = await getSmartResponse(message, finalSessionId, history);

        // 3. Save AI Message
        await saveMessage(finalSessionId, 'assistant', reply);

        res.json({ reply, sessionId: finalSessionId });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Ingest Endpoint (Admin only ideally, but public for now for setup)
router.post('/ingest', async (req, res) => {
    try {
        const { html, source } = req.body;
        if (!html) return res.status(400).json({ error: 'HTML content required' });

        const count = await ingestHtmlContent(html, source || 'upload');
        res.json({ success: true, chunks: count });
    } catch (error) {
        console.error('Ingest Error:', error);
        res.status(500).json({ error: 'Ingestion Failed' });
    }
});

// History Endpoint (Admin)
router.get('/history', async (req, res) => {
    try {
        const sessions = await ChatSession.find().sort({ updatedAt: -1 }).limit(50);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
