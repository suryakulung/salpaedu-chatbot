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
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

app.use(cors({
  origin: true, // Allocates any origin (including null for file://)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot Server is running 🚀', status: 'ok' });
});

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date(),
    db_status: dbStatus
  });
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

// ✅ Start server
const start = async () => {
  // Start listening immediately
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} (v3 - Resilient)`);
  });

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    // Don't exit, just log error so server stays up
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // Don't exit, allow server to keep running for health checks
  }
};

start();
