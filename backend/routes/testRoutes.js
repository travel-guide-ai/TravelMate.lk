import express from 'express';
import { createTestUser, testWebhook, createClerkUser } from '../controllers/testController.js';
import { syncClerkUsers, getUserStats } from '../controllers/syncController.js';

const router = express.Router();

// Create a test user to verify MongoDB connection
router.post('/create-user', createTestUser);

// Create user from Clerk data (manual sync)
router.post('/create-clerk-user', createClerkUser);

// Test webhook endpoint
router.post('/webhook', testWebhook);

// Sync existing Clerk users to MongoDB (requires Clerk secret key)
router.post('/sync-users', syncClerkUsers);

// Get user statistics (requires Clerk secret key)
router.get('/user-stats', getUserStats);

export default router;