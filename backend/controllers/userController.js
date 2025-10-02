import { getUserByClerkId, updateUserProfile, getAllUsers } from '../services/userService.js';

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