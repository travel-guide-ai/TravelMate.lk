import express from 'express';
import { 
  getCurrentUser, 
  updateProfile, 
  getUsers, 
  followUserController, 
  unfollowUserController, 
  getFollowers, 
  getFollowing, 
  getSuggestions, 
  searchUsersController 
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current authenticated user
router.get('/me', requireAuth, getCurrentUser);

// Update user profile
router.put('/profile', requireAuth, updateProfile);

// Get all users (for admin or discovery features)
router.get('/', getUsers);

// Search users
router.get('/search', searchUsersController);

// Social functionality
router.post('/follow', requireAuth, followUserController);
router.post('/unfollow', requireAuth, unfollowUserController);

// Get followers/following for a specific user
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id/suggestions', getSuggestions);

export default router;