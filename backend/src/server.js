import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import sequelize, { testConnection, syncDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { startPayoutScheduler } from './cron/payoutScheduler.js';
import { startSIPScheduler } from './cron/sipScheduler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'development'
  ? [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
      'http://localhost:3007',
      'http://localhost:3008',
      'http://localhost:3009',
      'http://localhost:3010',
    ]
  : [process.env.FRONTEND_URL];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rate limiting (relaxed for development)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // 10000 for dev, 100 for production
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to OWNLY Sandbox API',
    version: '1.0.0',
    documentation: '/api/health',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('\n🚀 Starting OWNLY Sandbox Backend...\n');

    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Sync database (create tables if they don't exist)
    // NOTE: In production, use migrations instead of sync
    if (process.env.NODE_ENV === 'development') {
      // Just verify tables exist, don't alter them (tables created via npm run setup:db)
      await syncDatabase({ alter: false });
    }

    // Start server
    app.listen(PORT, () => {
      console.log('\n✅ Server started successfully!\n');
      console.log('=' .repeat(50));
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
      console.log('=' .repeat(50));
      console.log('\n📚 Available API Routes:');
      console.log('   POST   /api/auth/signup');
      console.log('   POST   /api/auth/login');
      console.log('   GET    /api/auth/profile');
      console.log('   GET    /api/deals');
      console.log('   GET    /api/deals/:id');
      console.log('   POST   /api/deals');
      console.log('   POST   /api/investments');
      console.log('   GET    /api/investments/my-investments');
      console.log('   GET    /api/spvs/:id');
      console.log('   GET    /api/spvs/:id/cap-table');
      console.log('\n');

      // Start cron jobs
      startPayoutScheduler();
      startSIPScheduler();
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n📦 SIGTERM received. Closing server gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n📦 SIGINT received. Closing server gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;
