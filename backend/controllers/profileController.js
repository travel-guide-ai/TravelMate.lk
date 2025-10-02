import User from '../models/User.js';
import { getUserByClerkId } from '../services/userService.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk user ID from middleware
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return profile data without sensitive information
    const profileData = {
      _id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      profile: user.profile,
      statistics: user.statistics,
      socialProfile: {
        isPublic: user.socialProfile.isPublic,
        followersCount: user.socialProfile.followers.length,
        followingCount: user.socialProfile.following.length,
      },
      settings: user.settings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk user ID from middleware
    const updateData = req.body;

    // Validate and sanitize update data
    const allowedProfileUpdates = [
      'profile.bio',
      'profile.location',
      'profile.interests',
      'profile.travelStyle',
      'profile.preferences',
      'profile.language',
      'profile.avatar',
      'profile.phoneNumber',
      'profile.dateOfBirth',
      'profile.nationality'
    ];

    const allowedSettingsUpdates = [
      'settings.emailNotifications',
      'settings.pushNotifications',
      'settings.smsNotifications',
      'settings.privacy',
      'settings.twoFactorAuth',
      'settings.dataSharing',
      'settings.theme',
      'settings.currency',
      'settings.timeZone'
    ];

    const allowedSocialUpdates = [
      'socialProfile.isPublic'
    ];

    const allAllowedUpdates = [...allowedProfileUpdates, ...allowedSettingsUpdates, ...allowedSocialUpdates];

    const sanitizedData = {};
    Object.keys(updateData).forEach(key => {
      if (allAllowedUpdates.includes(key)) {
        // Handle nested object updates
        if (key.includes('.')) {
          const [parent, child] = key.split('.');
          if (!sanitizedData[parent]) {
            sanitizedData[parent] = {};
          }
          sanitizedData[parent][child] = updateData[key];
        } else {
          sanitizedData[key] = updateData[key];
        }
      }
    });

    if (Object.keys(sanitizedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: sanitizedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return updated profile data
    const profileData = {
      _id: updatedUser._id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      profile: updatedUser.profile,
      statistics: updatedUser.statistics,
      socialProfile: {
        isPublic: updatedUser.socialProfile.isPublic,
        followersCount: updatedUser.socialProfile.followers.length,
        followingCount: updatedUser.socialProfile.following.length,
      },
      settings: updatedUser.settings,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profileData
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get public profile by user ID (for viewing other users' profiles)
export const getPublicProfile = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const { userId: currentUserId } = req.auth; // Current authenticated user
    
    const user = await User.findById(targetUserId).populate('bookmarks', 'name description images');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check privacy settings
    if (!user.socialProfile.isPublic && user.clerkId !== currentUserId) {
      // Check if current user is following the target user
      const currentUser = await getUserByClerkId(currentUserId);
      const isFollowing = currentUser && user.socialProfile.followers.includes(currentUser._id);
      
      if (!isFollowing && user.settings.privacy === 'private') {
        return res.status(403).json({
          success: false,
          message: 'This profile is private'
        });
      }
      
      if (user.settings.privacy === 'friends' && !isFollowing) {
        return res.status(403).json({
          success: false,
          message: 'This profile is only visible to connections'
        });
      }
    }

    // Increment profile views if not viewing own profile
    if (user.clerkId !== currentUserId) {
      await User.findByIdAndUpdate(targetUserId, {
        $inc: { 'statistics.profileViews': 1 }
      });
    }

    // Return public profile data
    const publicProfile = {
      _id: user._id,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        username: user.profile.username,
        bio: user.profile.bio,
        location: user.profile.location,
        interests: user.profile.interests,
        travelStyle: user.profile.travelStyle,
        avatar: user.profile.avatar,
        nationality: user.profile.nationality
      },
      statistics: user.statistics,
      socialProfile: {
        isPublic: user.socialProfile.isPublic,
        followersCount: user.socialProfile.followers.length,
        followingCount: user.socialProfile.following.length,
      },
      bookmarks: user.bookmarks,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Upload profile avatar
export const uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { 'profile.avatar': avatarUrl } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: updatedUser.profile.avatar
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    // Find and delete user
    const deletedUser = await User.findOneAndDelete({ clerkId: userId });
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // TODO: Clean up related data (bookmarks, reviews, itineraries, etc.)
    // This should be implemented based on your data relationships

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};