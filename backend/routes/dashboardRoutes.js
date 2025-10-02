import express from 'express';
import { 
  getDashboardOverview, 
  getTravelAnalytics, 
  getPersonalizedRecommendations, 
  getRecentNotifications, 
  updateUserActivity 
} from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get dashboard overview data
router.get('/overview', requireAuth, getDashboardOverview);

// Get user's travel analytics
router.get('/analytics', requireAuth, getTravelAnalytics);

// Get personalized recommendations
router.get('/recommendations', requireAuth, getPersonalizedRecommendations);

// Get recent notifications
router.get('/notifications', requireAuth, getRecentNotifications);

// Update user activity status
router.post('/activity', requireAuth, updateUserActivity);

export default router;