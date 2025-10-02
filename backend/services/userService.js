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

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const followUser = async (currentUserId, targetUserId) => {
  try {
    // Check if users exist
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new Error('User not found');
    }

    // Check if already following
    if (currentUser.socialProfile.following.includes(targetUserId)) {
      throw new Error('Already following this user');
    }

    // Add to following list of current user
    await User.findByIdAndUpdate(currentUserId, {
      $push: { 'socialProfile.following': targetUserId }
    });

    // Add to followers list of target user
    await User.findByIdAndUpdate(targetUserId, {
      $push: { 'socialProfile.followers': currentUserId }
    });

    return { message: 'Successfully followed user' };
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    // Check if users exist
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new Error('User not found');
    }

    // Remove from following list of current user
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { 'socialProfile.following': targetUserId }
    });

    // Remove from followers list of target user
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { 'socialProfile.followers': currentUserId }
    });

    return { message: 'Successfully unfollowed user' };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const getUserFollowers = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'socialProfile.followers',
        select: 'firstName lastName username avatar bio location travelStyle interests socialProfile.followers socialProfile.following'
      });

    if (!user) {
      throw new Error('User not found');
    }

    // Add follower/following counts to each follower
    const followersWithCounts = user.socialProfile.followers.map(follower => ({
      ...follower.toObject(),
      followersCount: follower.socialProfile.followers.length,
      followingCount: follower.socialProfile.following.length
    }));

    return followersWithCounts;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

export const getUserFollowing = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'socialProfile.following',
        select: 'firstName lastName username avatar bio location travelStyle interests socialProfile.followers socialProfile.following'
      });

    if (!user) {
      throw new Error('User not found');
    }

    // Add follower/following counts to each following
    const followingWithCounts = user.socialProfile.following.map(following => ({
      ...following.toObject(),
      followersCount: following.socialProfile.followers.length,
      followingCount: following.socialProfile.following.length
    }));

    return followingWithCounts;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

export const getUserSuggestions = async (userId, limit = 10) => {
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Get users that current user is not following and exclude self
    const suggestions = await User.find({
      _id: { 
        $nin: [
          ...currentUser.socialProfile.following,
          userId
        ]
      }
    })
    .select('firstName lastName username avatar bio location travelStyle interests socialProfile.followers socialProfile.following')
    .limit(limit)
    .sort({ createdAt: -1 });

    // Add follower/following counts to suggestions
    const suggestionsWithCounts = suggestions.map(suggestion => ({
      ...suggestion.toObject(),
      followersCount: suggestion.socialProfile.followers.length,
      followingCount: suggestion.socialProfile.following.length
    }));

    return suggestionsWithCounts;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

export const searchUsers = async (query, excludeUserId = null, limit = 20) => {
  try {
    const searchRegex = new RegExp(query, 'i');
    
    const searchCriteria = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ]
    };

    // Exclude specific user if provided
    if (excludeUserId) {
      searchCriteria._id = { $ne: excludeUserId };
    }

    const users = await User.find(searchCriteria)
      .select('firstName lastName username avatar bio location travelStyle interests socialProfile.followers socialProfile.following')
      .limit(limit)
      .sort({ createdAt: -1 });

    // Add follower/following counts to search results
    const usersWithCounts = users.map(user => ({
      ...user.toObject(),
      followersCount: user.socialProfile.followers.length,
      followingCount: user.socialProfile.following.length
    }));

    return usersWithCounts;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};