import Notification from '../models/Notification.js';
import User from '../models/User.js';

export class NotificationService {
  // Create a notification
  static async createNotification({
    recipientId,
    senderId = null,
    type,
    title,
    message,
    data = {},
    priority = 'normal',
    channels = { inApp: true, email: false, push: false, sms: false },
    scheduledFor = null,
    expiresAt = null,
    groupKey = null
  }) {
    try {
      const notificationData = {
        recipient: recipientId,
        sender: senderId,
        type,
        title,
        message,
        data,
        priority,
        channels,
        scheduledFor,
        expiresAt,
        groupKey
      };

      // Try to create notification (may be grouped)
      try {
        const notification = await Notification.createNotification(notificationData);
        
        // If successful, trigger delivery
        if (notification) {
          await this.deliverNotification(notification);
        }
        
        return notification;
      } catch (error) {
        if (error.message === 'GROUPED') {
          // Notification was grouped, return success
          return { grouped: true };
        }
        throw error;
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Deliver notification through enabled channels
  static async deliverNotification(notification) {
    const deliveryPromises = [];

    // In-app delivery (always enabled)
    if (notification.channels.inApp) {
      deliveryPromises.push(this.deliverInApp(notification));
    }

    // Email delivery
    if (notification.channels.email) {
      deliveryPromises.push(this.deliverEmail(notification));
    }

    // Push notification delivery
    if (notification.channels.push) {
      deliveryPromises.push(this.deliverPush(notification));
    }

    // SMS delivery
    if (notification.channels.sms) {
      deliveryPromises.push(this.deliverSMS(notification));
    }

    // Execute all deliveries in parallel
    try {
      await Promise.allSettled(deliveryPromises);
    } catch (error) {
      console.error('Error in notification delivery:', error);
    }
  }

  // In-app notification delivery
  static async deliverInApp(notification) {
    try {
      await notification.markAsDelivered('inApp');
      
      // Here you would typically emit a real-time event
      // For example, using Socket.IO:
      // io.to(notification.recipient.toString()).emit('notification', notification);
      
      console.log(`In-app notification delivered to user ${notification.recipient}`);
      return true;
    } catch (error) {
      console.error('Error delivering in-app notification:', error);
      return false;
    }
  }

  // Email notification delivery
  static async deliverEmail(notification) {
    try {
      // Here you would integrate with an email service like SendGrid, AWS SES, etc.
      // For now, we'll just simulate the delivery
      
      const user = await User.findById(notification.recipient);
      if (!user || !user.email) {
        throw new Error('User email not found');
      }

      // Simulate email sending
      console.log(`Email notification sent to ${user.email}: ${notification.title}`);
      
      await notification.markAsDelivered('email');
      return true;
    } catch (error) {
      console.error('Error delivering email notification:', error);
      return false;
    }
  }

  // Push notification delivery
  static async deliverPush(notification) {
    try {
      // Here you would integrate with a push notification service like FCM, APNs, etc.
      // For now, we'll just simulate the delivery
      
      const user = await User.findById(notification.recipient);
      if (!user) {
        throw new Error('User not found');
      }

      // Simulate push notification sending
      console.log(`Push notification sent to user ${user._id}: ${notification.title}`);
      
      await notification.markAsDelivered('push');
      return true;
    } catch (error) {
      console.error('Error delivering push notification:', error);
      return false;
    }
  }

  // SMS notification delivery
  static async deliverSMS(notification) {
    try {
      // Here you would integrate with an SMS service like Twilio, AWS SNS, etc.
      // For now, we'll just simulate the delivery
      
      const user = await User.findById(notification.recipient);
      if (!user || !user.profile.phoneNumber) {
        throw new Error('User phone number not found');
      }

      // Simulate SMS sending
      console.log(`SMS notification sent to ${user.profile.phoneNumber}: ${notification.title}`);
      
      await notification.markAsDelivered('sms');
      return true;
    } catch (error) {
      console.error('Error delivering SMS notification:', error);
      return false;
    }
  }

  // Helper methods for common notification types
  static async notifyUserFollowed(followerId, followedUserId) {
    const follower = await User.findById(followerId);
    const followed = await User.findById(followedUserId);

    if (!follower || !followed) return;

    return await this.createNotification({
      recipientId: followedUserId,
      senderId: followerId,
      type: 'follow',
      title: 'New Follower',
      message: `${follower.profile.firstName} ${follower.profile.lastName} started following you`,
      data: {
        entityType: 'user',
        entityId: followerId,
        actionUrl: `/profile/${followerId}`
      },
      channels: { inApp: true, push: true },
      groupKey: `follow_${followedUserId}`
    });
  }

  static async notifyDestinationLiked(likerId, destinationId, ownerId) {
    const liker = await User.findById(likerId);
    if (!liker || likerId.toString() === ownerId.toString()) return;

    return await this.createNotification({
      recipientId: ownerId,
      senderId: likerId,
      type: 'like',
      title: 'Destination Liked',
      message: `${liker.profile.firstName} liked a destination you bookmarked`,
      data: {
        entityType: 'destination',
        entityId: destinationId,
        actionUrl: `/destinations/${destinationId}`
      },
      channels: { inApp: true },
      groupKey: `like_destination_${destinationId}`
    });
  }

  static async notifyItineraryShared(sharerId, itineraryId, recipientId) {
    const sharer = await User.findById(sharerId);
    if (!sharer) return;

    return await this.createNotification({
      recipientId: recipientId,
      senderId: sharerId,
      type: 'itinerary_shared',
      title: 'Itinerary Shared',
      message: `${sharer.profile.firstName} shared an itinerary with you`,
      data: {
        entityType: 'itinerary',
        entityId: itineraryId,
        actionUrl: `/itineraries/${itineraryId}`
      },
      channels: { inApp: true, email: true, push: true },
      priority: 'high'
    });
  }

  static async notifyReviewPosted(reviewerId, destinationId, destinationOwnerId) {
    const reviewer = await User.findById(reviewerId);
    if (!reviewer || reviewerId.toString() === destinationOwnerId.toString()) return;

    return await this.createNotification({
      recipientId: destinationOwnerId,
      senderId: reviewerId,
      type: 'review',
      title: 'New Review',
      message: `${reviewer.profile.firstName} posted a review on a destination you bookmarked`,
      data: {
        entityType: 'destination',
        entityId: destinationId,
        actionUrl: `/destinations/${destinationId}#reviews`
      },
      channels: { inApp: true },
      groupKey: `review_${destinationId}`
    });
  }

  static async notifyWelcome(userId) {
    return await this.createNotification({
      recipientId: userId,
      type: 'welcome',
      title: 'Welcome to TravelMate!',
      message: 'Welcome to TravelMate! Start exploring amazing destinations and creating your travel memories.',
      data: {
        entityType: 'system',
        actionUrl: '/explore'
      },
      channels: { inApp: true, email: true },
      priority: 'high'
    });
  }

  static async notifyAchievement(userId, achievementType, achievementData) {
    const achievementMessages = {
      first_review: 'Congratulations! You wrote your first review.',
      explorer: 'Achievement unlocked: Explorer! You\'ve bookmarked 10 destinations.',
      social_butterfly: 'Achievement unlocked: Social Butterfly! You have 50 followers.',
      globetrotter: 'Achievement unlocked: Globetrotter! You\'ve visited 5 countries.'
    };

    return await this.createNotification({
      recipientId: userId,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: achievementMessages[achievementType] || 'You unlocked a new achievement!',
      data: {
        entityType: 'system',
        actionUrl: '/profile/achievements',
        metadata: achievementData
      },
      channels: { inApp: true, push: true },
      priority: 'high'
    });
  }

  static async notifyTravelAlert(userId, alertType, alertData) {
    const alertMessages = {
      weather: 'Weather alert for your upcoming trip',
      safety: 'Safety update for your destination',
      price_drop: 'Price drop alert for destinations you\'re watching'
    };

    return await this.createNotification({
      recipientId: userId,
      type: 'travel_alert',
      title: 'Travel Alert',
      message: alertMessages[alertType] || 'Important travel information',
      data: {
        entityType: 'system',
        metadata: alertData
      },
      channels: { inApp: true, email: true, push: true },
      priority: 'urgent'
    });
  }

  // Bulk notification creation
  static async createBulkNotifications(notifications) {
    const results = [];
    
    for (const notificationData of notifications) {
      try {
        const result = await this.createNotification(notificationData);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Clean up old notifications
  static async cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      status: { $in: ['read', 'archived'] }
    });
    
    console.log(`Cleaned up ${result.deletedCount} old notifications`);
    return result;
  }
}