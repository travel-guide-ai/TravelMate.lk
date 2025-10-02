import { getUserByClerkId, updateUserProfile, getAllUsers, getUserById, followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserSuggestions, searchUsers } from '../services/userService.js';

export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk user ID from middleware
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk user ID from middleware
    const updateData = req.body;

    // Validate and sanitize update data
    const allowedUpdates = [
      'profile.dateOfBirth',
      'profile.nationality',
      'profile.preferences',
      'profile.language',
      'settings.emailNotifications',
      'settings.pushNotifications',
      'settings.privacy'
    ];

    const sanitizedData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        sanitizedData[key] = updateData[key];
      }
    });

    const updatedUser = await updateUserProfile(userId, sanitizedData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await getAllUsers(parseInt(page), parseInt(limit));
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Social functionality
export const followUserController = async (req, res) => {
  try {
    const { userId } = req.auth; // Current user's Clerk ID
    const { userId: targetUserId } = req.body; // User to follow (MongoDB ID)

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    const currentUser = await getUserByClerkId(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found'
      });
    }

    const result = await followUser(currentUser._id, targetUserId);
    
    res.status(200).json({
      success: true,
      message: 'User followed successfully',
      ...result
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const unfollowUserController = async (req, res) => {
  try {
    const { userId } = req.auth; // Current user's Clerk ID
    const { userId: targetUserId } = req.body; // User to unfollow (MongoDB ID)

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    const currentUser = await getUserByClerkId(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found'
      });
    }

    const result = await unfollowUser(currentUser._id, targetUserId);
    
    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
      ...result
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { id: targetUserId } = req.params; // User whose followers to get

    const followers = await getUserFollowers(targetUserId);
    
    res.status(200).json({
      success: true,
      followers
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { id: targetUserId } = req.params; // User whose following to get

    const following = await getUserFollowing(targetUserId);
    
    res.status(200).json({
      success: true,
      following
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const { id: targetUserId } = req.params; // User to get suggestions for

    const suggestions = await getUserSuggestions(targetUserId);
    
    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const searchUsersController = async (req, res) => {
  try {
    const { q: query, exclude } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const users = await searchUsers(query.trim(), exclude);
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};