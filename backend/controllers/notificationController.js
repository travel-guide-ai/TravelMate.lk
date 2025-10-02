import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getUserByClerkId } from '../services/userService.js';

// Get user notifications with pagination and filtering
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk user ID from middleware
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const {
      page = 1,
      limit = 20,
      status = 'all', // all, unread, read, archived
      type = 'all',
      priority = 'all'
    } = req.query;

    // Build filter
    const filter = { recipient: user._id };
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (type !== 'all') {
      filter.type = type;
    }
    
    if (priority !== 'all') {
      filter.priority = priority;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notifications with sender information
    const notifications = await Notification.find(filter)
      .populate('sender', 'profile.firstName profile.lastName profile.username profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalCount = await Notification.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recipient: user._id,
      status: 'unread'
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        },
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { notificationId } = req.params;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await Notification.updateMany(
      { 
        recipient: user._id, 
        status: 'unread' 
      },
      { 
        status: 'read',
        'delivery.inApp.readAt': new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { notificationId } = req.params;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Archive notification
export const archiveNotification = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { notificationId } = req.params;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: user._id
      },
      { status: 'archived' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification archived successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get counts by status
    const stats = await Notification.aggregate([
      { $match: { recipient: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by type for unread notifications
    const typeStats = await Notification.aggregate([
      { 
        $match: { 
          recipient: user._id,
          status: 'unread'
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const statusCounts = {
      unread: 0,
      read: 0,
      archived: 0,
      total: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
      statusCounts.total += stat.count;
    });

    const typeCounts = {};
    typeStats.forEach(stat => {
      typeCounts[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        typeCounts,
        hasUnread: statusCounts.unread > 0
      }
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { preferences } = req.body;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate preferences structure
    const allowedPreferences = [
      'emailNotifications',
      'pushNotifications',
      'smsNotifications',
      'notificationTypes'
    ];

    const updateData = {};
    
    Object.keys(preferences).forEach(key => {
      if (allowedPreferences.includes(key)) {
        updateData[`settings.${key}`] = preferences[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid preferences provided'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('settings');

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: {
        settings: updatedUser.settings
      }
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get recent notifications for real-time updates
export const getRecentNotifications = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { since } = req.query; // Timestamp to get notifications since
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const filter = { recipient: user._id };
    
    if (since) {
      filter.createdAt = { $gt: new Date(since) };
    } else {
      // Default to last 5 minutes for real-time updates
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      filter.createdAt = { $gt: fiveMinutesAgo };
    }

    const notifications = await Notification.find(filter)
      .populate('sender', 'profile.firstName profile.lastName profile.username profile.avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        notifications,
        count: notifications.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};