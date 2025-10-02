import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { NotificationService } from './services/notificationService.js';
import User from './models/User.js';

dotenv.config();

const seedNotifications = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database...');

    // Find a test user (you can replace this with a real user ID)
    const testUser = await User.findOne();
    if (!testUser) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Creating test notifications for user: ${testUser.email}`);

    // Create test notifications
    const notifications = [
      {
        recipientId: testUser._id,
        type: 'welcome',
        title: 'Welcome to TravelMate!',
        message: 'Welcome to TravelMate! Start exploring amazing destinations and creating your travel memories.',
        priority: 'high',
        channels: { inApp: true, email: true, push: true }
      },
      {
        recipientId: testUser._id,
        type: 'follow',
        title: 'New Follower',
        message: 'John Doe started following you',
        channels: { inApp: true, push: true },
        groupKey: `follow_${testUser._id}`
      },
      {
        recipientId: testUser._id,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'Congratulations! You wrote your first review.',
        priority: 'high',
        channels: { inApp: true, push: true }
      },
      {
        recipientId: testUser._id,
        type: 'destination_recommendation',
        title: 'New Destination Recommendation',
        message: 'We found 5 new destinations that match your interests',
        channels: { inApp: true, email: true }
      },
      {
        recipientId: testUser._id,
        type: 'travel_alert',
        title: 'Travel Alert',
        message: 'Weather update for your upcoming trip to Tokyo',
        priority: 'urgent',
        channels: { inApp: true, email: true, push: true, sms: true }
      },
      {
        recipientId: testUser._id,
        type: 'like',
        title: 'Content Liked',
        message: 'Someone liked your review of Sigiriya Rock',
        channels: { inApp: true, push: true },
        groupKey: `like_${testUser._id}`
      },
      {
        recipientId: testUser._id,
        type: 'system_update',
        title: 'System Update',
        message: 'TravelMate has been updated with new features. Check out what\'s new!',
        channels: { inApp: true, email: true }
      }
    ];

    // Create notifications using the service
    console.log('Creating notifications...');
    for (const notificationData of notifications) {
      try {
        const result = await NotificationService.createNotification(notificationData);
        console.log(`✓ Created: ${notificationData.title}`);
      } catch (error) {
        console.log(`✗ Failed to create: ${notificationData.title} - ${error.message}`);
      }
    }

    console.log('✓ Test notifications created successfully!');
    
  } catch (error) {
    console.error('Error seeding notifications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the seed function
seedNotifications();