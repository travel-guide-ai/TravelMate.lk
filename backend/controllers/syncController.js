import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

export const syncClerkUsers = async (req, res) => {
  try {
    console.log('Starting Clerk user sync...');
    
    // Get all users from Clerk
    const clerkUsers = await clerkClient.users.getUserList();
    console.log(`Found ${clerkUsers.length} users in Clerk`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    for (const clerkUser of clerkUsers) {
      try {
        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({ clerkId: clerkUser.id });
        
        if (existingUser) {
          console.log(`User ${clerkUser.id} already exists in MongoDB, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Get primary email
        const primaryEmail = clerkUser.emailAddresses.find(
          email => email.id === clerkUser.primaryEmailAddressId
        );
        
        if (!primaryEmail) {
          console.log(`No primary email for user ${clerkUser.id}, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Create user in MongoDB
        const newUser = new User({
          clerkId: clerkUser.id,
          email: primaryEmail.emailAddress,
          emailVerified: primaryEmail.verification?.status === 'verified',
          profile: {
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            username: clerkUser.username || '',
            phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || '',
            avatar: clerkUser.imageUrl || '',
          },
          settings: {
            emailNotifications: true,
            pushNotifications: true,
            privacy: 'public',
          },
          lastActive: new Date(),
        });
        
        await newUser.save();
        console.log(`Synced user: ${clerkUser.id} (${primaryEmail.emailAddress})`);
        syncedCount++;
        
      } catch (userError) {
        console.error(`Error syncing user ${clerkUser.id}:`, userError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'User sync completed',
      stats: {
        total: clerkUsers.length,
        synced: syncedCount,
        skipped: skippedCount
      }
    });
    
  } catch (error) {
    console.error('Error syncing Clerk users:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing users',
      error: error.message
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const mongoUsers = await User.countDocuments();
    const clerkUsers = await clerkClient.users.getCount();
    
    res.status(200).json({
      success: true,
      stats: {
        clerkUsers,
        mongoUsers,
        syncDifference: clerkUsers - mongoUsers
      }
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting stats',
      error: error.message
    });
  }
};