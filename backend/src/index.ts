import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

import dataRoutes from './routes/dataRoutes';
import treeRoutes from './routes/treeRoutes';
import quoteRoutes from './routes/quoteRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { QuoteService } from './services/QuoteService';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize services
const quoteService = new QuoteService();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/users', limiter);

// Routes
app.use('/', dataRoutes);
app.use('/', treeRoutes);
app.use('/', quoteRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket handling
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      // Validate message format
      const messageSchema = z.object({
        type: z.enum(['subscribe', 'unsubscribe']),
        symbols: z.array(z.string())
      });
      
      const validatedMessage = messageSchema.parse(message);
      
      if (validatedMessage.type === 'subscribe') {
        quoteService.subscribe(ws, validatedMessage);
      } else if (validatedMessage.type === 'unsubscribe') {
        quoteService.unsubscribe(ws);
      }
    } catch (error) {
      console.error('Invalid WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    quoteService.unsubscribe(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    quoteService.unsubscribe(ws);
  });
  
  // Send ping every 15 seconds
  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 15000);
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start quote updates
quoteService.startUpdates(20); // 20 updates per second

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  quoteService.stopUpdates();
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  quoteService.stopUpdates();
  server.close(() => {
    console.log('Process terminated');
  });
});
