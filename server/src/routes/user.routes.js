import { Router } from 'express';
import {
  handleSignUp,
  handleLogin,
  handleGetUser,
  handleAddFriend,
  handleRemoveFriend,
  handleGetFriends
} from '../controllers/user.controller.js';

const router = Router();

// Auth routes
router.post('/signup', handleSignUp);           // POST /api/users/signup
router.post('/login', handleLogin);             // POST /api/users/login

// User routes
router.get('/:user_id', handleGetUser);         // GET /api/users/:user_id

// Friend routes
router.post('/:user_id/friends', handleAddFriend);              // POST /api/users/:user_id/friends
router.delete('/:user_id/friends/:friend_id', handleRemoveFriend); // DELETE /api/users/:user_id/friends/:friend_id
router.get('/:user_id/friends', handleGetFriends);              // GET /api/users/:user_id/friends

export default router;