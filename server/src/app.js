import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import locationRoutes from './routes/location.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config({
    path: '../.env'
});


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/locations', locationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export { app };