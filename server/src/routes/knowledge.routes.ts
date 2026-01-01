import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import KnowledgeChunk from '../models/KnowledgeChunk';
import { ingestText } from '../services/IngestionService';
import { refreshVectorStore } from '../utils/vectorStore';

const router = express.Router();

// Get all chunks
router.get('/', authMiddleware, async (req, res) => {
    try {
        const chunks = await KnowledgeChunk.find().sort({ createdAt: -1 });
        res.json(chunks);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Add new chunk (Manual text)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { text, source } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        await ingestText(text, source || 'manual');
        res.json({ success: true });
    } catch (error: any) {
        console.error('Add Knowledge Error:', error);
        // If it's an OpenAI error, tell the user
        if (error.response?.data?.error?.message) {
            return res.status(500).json({ error: `AI Error: ${error.response.data.error.message}` });
        }
        res.status(500).json({ error: error.message || 'Server Error' });
    }
});

// Update chunk
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        const chunk = await KnowledgeChunk.findByIdAndUpdate(
            req.params.id,
            { content: text },
            { new: true }
        );

        if (!chunk) return res.status(404).json({ error: 'Chunk not found' });

        // Refresh vector store to update embeddings
        try {
            await refreshVectorStore();
        } catch (refreshError) {
            console.error('Vector Refresh Failed:', refreshError);
        }

        res.json({ success: true, chunk });
    } catch (error: any) {
        console.error('Update Knowledge Error:', error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
});

// Delete chunk
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await KnowledgeChunk.findByIdAndDelete(req.params.id);
        try {
            await refreshVectorStore();
        } catch (refreshError) {
            console.error('Vector Refresh Failed:', refreshError);
            // Don't fail the request if just the cache update failed
        }
        res.json({ success: true });
    } catch (error: any) {
        console.error('Delete Knowledge Error:', error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
});

export default router;
