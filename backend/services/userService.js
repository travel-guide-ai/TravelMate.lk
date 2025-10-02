import User from '../models/User.js';

export const getUserByClerkId = async (clerkId) => {
  try {
    const user = await User.findOne({ clerkId }).populate('bookmarks itineraries');
    return user;
  } catch (error) {
    console.error('Error fetching user by Clerk ID:', error);
    throw error;
  }
};

export const updateUserProfile = async (clerkId, updateData) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      { 
        ...updateData,
        lastActive: new Date()
      },
      { new: true, runValidators: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const deleteUserByClerkId = async (clerkId) => {
  try {
    const user = await User.findOneAndDelete({ clerkId });
    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const users = await User.find({})
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};