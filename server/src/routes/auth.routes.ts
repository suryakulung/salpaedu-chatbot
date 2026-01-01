import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
    try {
        const { password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const jwtSecret = process.env.JWT_SECRET || 'secret';

        console.log('Login Attempt:', {
            received: password ? '***' : 'missing',
            expected: '***',
            secretConfigured: !!jwtSecret
        });

        if (password && password.trim() === adminPassword.trim()) {
            if (!jwtSecret) throw new Error('JWT_SECRET is missing');

            const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '24h' });
            return res.json({ token });
        }

        return res.status(401).json({ error: 'Invalid password' });
    } catch (error: any) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
