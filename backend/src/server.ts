import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import keywordRoutes from './routes/keywords';
import serpRoutes from './routes/serp';
import settingsRoutes from './routes/settings';
import historyRoutes from './routes/history';
import searchHistoryRoutes from './routes/searchHistory';
import trendingRoutes from './routes/trending';
import testRoutes from './routes/test';
import { errorHandler } from './middleware/auth';
import { testConnection } from './database/connection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check
app.get('/api/health/db', async (req: Request, res: Response) => {
  try {
    const isConnected = await testConnection();
    res.status(isConnected ? 200 : 503).json({
      status: isConnected ? 'ok' : 'error',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', settingsRoutes);
app.use('/api', searchHistoryRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/serp', serpRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/trending', trendingRoutes);
// app.use('/api/domains', domainRoutes);
// app.use('/api/competitors', competitorRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🗄️  Using: ${process.env.DATABASE_URL ? 'DATABASE_URL' : `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`}`);
  
  // Test database connection on startup
  await testConnection();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
