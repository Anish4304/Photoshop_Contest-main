import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/database';

// Load env vars from .env file in backend root directory
const envPath = path.resolve(__dirname, '../.env');
console.log(`📁 Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });
if (result.error && (result.error as any).code !== 'ENOENT') {
  console.warn('⚠️  Warning: Could not load .env file');
}
if (result.parsed) {
  console.log('✅ .env file loaded successfully');
}

// Import routes
import authRoutes from './routes/authRoutes';
import photographerRoutes from './routes/photographerRoutes';
import categoryRoutes from './routes/categoryRoutes';
import photoRoutes from './routes/photoRoutes';
import galleryRoutes from './routes/galleryRoutes';
import judgeRoutes from './routes/judgeRoutes';
import scoreRoutes from './routes/scoreRoutes';
import voteRoutes from './routes/voteRoutes';
import winnerRoutes from './routes/winnerRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import queryLogRoutes from './routes/queryLogRoutes';

const app: Application = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve static files (uploaded images) - MUST come before 404 handler
const uploadsPath = path.join(__dirname, '../uploads');
console.log(`📁 Uploads folder path: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/photographers', photographerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/judges', judgeRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/query-logs', queryLogRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Photography Contest API is running',
  });
});

// Handle 404 - must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error occurred:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start server function
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📷 Photography Contest Management System API`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

export default app;
