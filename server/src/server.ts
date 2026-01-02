import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import chatRoutes from './routes/chat.routes';
import authRoutes from './routes/auth.routes';
import knowledgeRoutes from './routes/knowledge.routes';
import leadRoutes from './routes/lead.routes';

// ✅ Load env vars FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ✅ Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/leads', leadRoutes);

// ✅ Debug Catch-all
app.use('*', (req, res) => {
  console.log(`❌ 404 Hit: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found', path: req.originalUrl, method: req.method });
});

// ✅ Start server AFTER DB connects
const start = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} (v2)`);
  });
};

start();
