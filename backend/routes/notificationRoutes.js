import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  archiveNotification,
  getNotificationStats,
  updateNotificationPreferences,
  getRecentNotifications
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user notifications with pagination and filtering
router.get('/', requireAuth, getUserNotifications);

// Get notification statistics
router.get('/stats', requireAuth, getNotificationStats);

// Get recent notifications for real-time updates
router.get('/recent', requireAuth, getRecentNotifications);

// Mark specific notification as read
router.patch('/:notificationId/read', requireAuth, markNotificationAsRead);

// Mark all notifications as read
router.patch('/read-all', requireAuth, markAllNotificationsAsRead);

// Archive notification
router.patch('/:notificationId/archive', requireAuth, archiveNotification);

// Delete notification
router.delete('/:notificationId', requireAuth, deleteNotification);

// Update notification preferences
router.put('/preferences', requireAuth, updateNotificationPreferences);

export default router;