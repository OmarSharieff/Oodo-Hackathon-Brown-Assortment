import { Router } from 'express';
import {
  handleAddReview,
  handleGetPosts,
  handleUpdatePostLikes // <--- Ensure this is imported
} from '../controllers/post.controller.js';

const router = Router();

// Review/Post routes
router.post('/', handleAddReview);          // POST /api/posts
router.get('/', handleGetPosts);            // GET /api/posts?page=1&limit=10
router.patch('/:post_id/likes', handleUpdatePostLikes); // PATCH /api/posts/:post_id/likes
export default router;