import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  getPublicProfile, 
  uploadAvatar, 
  deleteUserAccount 
} from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user's profile
router.get('/', requireAuth, getUserProfile);

// Update current user's profile
router.put('/', requireAuth, updateUserProfile);

// Get public profile by user ID
router.get('/:userId', requireAuth, getPublicProfile);

// Upload profile avatar
router.post('/avatar', requireAuth, uploadAvatar);

// Delete user account
router.delete('/account', requireAuth, deleteUserAccount);

export default router;