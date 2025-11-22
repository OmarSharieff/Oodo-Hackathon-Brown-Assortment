import { Router } from 'express';
import {
  handleAddReview,
  handleGetPosts
} from '../controllers/post.controller.js';

const router = Router();

// Review/Post routes
router.post('/', handleAddReview);          // POST /api/posts
router.get('/', handleGetPosts);            // GET /api/posts?page=1&limit=10

export default router;