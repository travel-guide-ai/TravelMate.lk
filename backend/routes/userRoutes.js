import express from 'express';
import { getCurrentUser, updateProfile, getUsers } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current authenticated user
router.get('/me', requireAuth, getCurrentUser);

// Update user profile
router.put('/profile', requireAuth, updateProfile);

// Get all users (for admin or discovery features)
router.get('/', getUsers);

export default router;