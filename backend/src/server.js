import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, dbStatus } from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  if (req.path !== '/api/health') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api', chatRoutes);

// Serve static frontend in production if built
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root route fallback
  app.get('/', (req, res) => {
    res.json({
      name: 'AI Chat Assistant Backend',
      version: '1.0.0',
      status: 'online',
      database: dbStatus.mode,
      endpoints: {
        health: 'GET /api/health',
        conversations: 'GET /api/conversations',
        createConversation: 'POST /api/conversations',
        getConversation: 'GET /api/conversations/:id',
        streamChat: 'POST /api/chat/stream',
        updateTone: 'PATCH /api/conversations/:id/tone',
        deleteConversation: 'DELETE /api/conversations/:id',
      },
    });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Initialize DB and Start Server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  AI Chat Assistant Backend`);
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log(`  Database status: ${dbStatus.mode.toUpperCase()}`);
    console.log(`  Streaming endpoint: POST /api/chat/stream`);
    console.log(`===============================================`);
  });
}

startServer();

