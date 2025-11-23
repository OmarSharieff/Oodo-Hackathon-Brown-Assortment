// server/src/routes/reviewRoutes.js

import express from 'express';
import multer from 'multer';
import { createReview, getReviews } from '../controllers/review.controller.js';
const router = express.Router();

// Configure multer for file uploads (stores in memory)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/reviews - Create review with optional image
router.post('/reviews', upload.single('image'), createReview);

// GET /api/reviews - Get all reviews
router.get('/reviews', getReviews);

export default router;