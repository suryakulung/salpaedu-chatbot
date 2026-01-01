import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import Lead from '../models/Lead';

const router = express.Router();

// Capture Lead (Public)
router.post('/', async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.json({ success: true, lead });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save lead' });
    }
});

// Get Leads (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
