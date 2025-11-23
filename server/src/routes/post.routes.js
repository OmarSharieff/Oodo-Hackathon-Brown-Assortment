import { Router } from 'express';
import multer from 'multer';
import {
  handleAddReview,
  handleGetPosts,
  handleUpdatePostLikes
} from '../controllers/post.controller.js';

const router = Router();

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

// Review/Post routes with image upload support
router.post('/', upload.single('image'), handleAddReview);
router.get('/', handleGetPosts);
router.patch('/:post_id/likes', handleUpdatePostLikes);

export default router;