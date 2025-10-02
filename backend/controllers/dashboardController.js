import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Itinerary from '../models/Itinerary.js';
import Review from '../models/Review.js';
import { getUserByClerkId } from '../services/userService.js';

// Get dashboard overview data
export const getDashboardOverview = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk user ID from middleware
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const stats = {
      totalDestinations: user.bookmarks.length,
      totalItineraries: user.itineraries.length,
      totalReviews: user.statistics.totalReviewsWritten,
      profileViews: user.statistics.profileViews,
      followersCount: user.socialProfile.followers.length,
      followingCount: user.socialProfile.following.length,
      memberSince: user.statistics.memberSince,
      lastActive: user.lastActive
    };

    // Get recent activity data
    const recentBookmarks = await Destination.find({
      _id: { $in: user.bookmarks.slice(-5) }
    }).select('name description images location rating').limit(5);

    const recentItineraries = await Itinerary.find({
      _id: { $in: user.itineraries.slice(-3) }
    }).select('title description startDate endDate destinations').limit(3);

    const recentReviews = await Review.find({
      user: user._id
    }).populate('destination', 'name images')
      .sort({ createdAt: -1 })
      .limit(3);

    // Calculate engagement metrics
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyActivity = {
      newBookmarks: await Destination.countDocuments({
        _id: { $in: user.bookmarks },
        createdAt: { $gte: thisMonth }
      }),
      newItineraries: await Itinerary.countDocuments({
        _id: { $in: user.itineraries },
        createdAt: { $gte: thisMonth }
      }),
      newReviews: await Review.countDocuments({
        user: user._id,
        createdAt: { $gte: thisMonth }
      })
    };

    const dashboardData = {
      user: {
        _id: user._id,
        profile: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          username: user.profile.username,
          avatar: user.profile.avatar,
          bio: user.profile.bio
        }
      },
      statistics: stats,
      recentActivity: {
        bookmarks: recentBookmarks,
        itineraries: recentItineraries,
        reviews: recentReviews
      },
      monthlyActivity,
      quickActions: [
        { action: 'create_itinerary', label: 'Create New Itinerary', icon: 'map' },
        { action: 'discover_destinations', label: 'Discover Destinations', icon: 'compass' },
        { action: 'write_review', label: 'Write a Review', icon: 'star' },
        { action: 'connect_friends', label: 'Connect with Friends', icon: 'users' }
      ]
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's travel analytics
export const getTravelAnalytics = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get destinations data
    const destinations = await Destination.find({
      _id: { $in: user.bookmarks }
    }).select('location category rating visitedCount');

    // Analyze travel patterns
    const analytics = {
      destinationsByCountry: {},
      destinationsByCategory: {},
      averageRating: 0,
      totalCountriesVisited: 0,
      favoriteCategories: [],
      travelScore: 0
    };

    destinations.forEach(dest => {
      // Count by country
      if (dest.location && dest.location.country) {
        analytics.destinationsByCountry[dest.location.country] = 
          (analytics.destinationsByCountry[dest.location.country] || 0) + 1;
      }

      // Count by category
      if (dest.category) {
        analytics.destinationsByCategory[dest.category] = 
          (analytics.destinationsByCategory[dest.category] || 0) + 1;
      }

      // Calculate average rating
      if (dest.rating) {
        analytics.averageRating += dest.rating;
      }
    });

    // Calculate final analytics
    analytics.totalCountriesVisited = Object.keys(analytics.destinationsByCountry).length;
    analytics.averageRating = destinations.length > 0 ? 
      (analytics.averageRating / destinations.length).toFixed(1) : 0;

    // Get favorite categories (top 3)
    analytics.favoriteCategories = Object.entries(analytics.destinationsByCategory)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));

    // Calculate travel score (0-100)
    analytics.travelScore = Math.min(100, 
      (destinations.length * 10) + 
      (analytics.totalCountriesVisited * 5) + 
      (user.statistics.totalReviewsWritten * 3)
    );

    // Get travel timeline
    const timeline = await Itinerary.find({
      _id: { $in: user.itineraries }
    }).select('title startDate endDate destinations')
      .sort({ startDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        analytics,
        timeline,
        totalDestinations: destinations.length,
        totalItineraries: user.itineraries.length
      }
    });
  } catch (error) {
    console.error('Error fetching travel analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get personalized recommendations
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's bookmarked destinations to understand preferences
    const userDestinations = await Destination.find({
      _id: { $in: user.bookmarks }
    }).select('category location rating tags');

    // Extract user preferences
    const preferredCategories = {};
    const preferredCountries = {};
    const preferredTags = {};

    userDestinations.forEach(dest => {
      if (dest.category) {
        preferredCategories[dest.category] = (preferredCategories[dest.category] || 0) + 1;
      }
      if (dest.location?.country) {
        preferredCountries[dest.location.country] = (preferredCountries[dest.location.country] || 0) + 1;
      }
      if (dest.tags) {
        dest.tags.forEach(tag => {
          preferredTags[tag] = (preferredTags[tag] || 0) + 1;
        });
      }
    });

    // Get top preferences
    const topCategories = Object.keys(preferredCategories).slice(0, 3);
    const topTags = Object.keys(preferredTags).slice(0, 5);

    // Find similar destinations
    const recommendedDestinations = await Destination.find({
      _id: { $nin: user.bookmarks }, // Exclude already bookmarked
      $or: [
        { category: { $in: topCategories } },
        { tags: { $in: topTags } },
        { 'location.country': { $in: Object.keys(preferredCountries) } }
      ]
    }).select('name description images location category rating tags')
      .sort({ rating: -1 })
      .limit(10);

    // Get trending destinations
    const trendingDestinations = await Destination.find({
      _id: { $nin: user.bookmarks }
    }).select('name description images location category rating')
      .sort({ visitedCount: -1, rating: -1 })
      .limit(5);

    // Get recommendations based on following
    const followingUsers = await User.find({
      _id: { $in: user.socialProfile.following }
    }).select('bookmarks').populate('bookmarks', 'name description images location rating');

    const friendsRecommendations = [];
    followingUsers.forEach(friend => {
      friend.bookmarks.forEach(dest => {
        if (!user.bookmarks.includes(dest._id) && 
            !friendsRecommendations.find(rec => rec._id.equals(dest._id))) {
          friendsRecommendations.push(dest);
        }
      });
    });

    res.status(200).json({
      success: true,
      data: {
        forYou: recommendedDestinations,
        trending: trendingDestinations,
        fromFriends: friendsRecommendations.slice(0, 5),
        preferences: {
          categories: topCategories,
          tags: topTags,
          countries: Object.keys(preferredCountries)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get recent notifications
export const getRecentNotifications = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mock notifications (implement based on your notification system)
    const notifications = [
      {
        id: 1,
        type: 'follower',
        message: 'You have 3 new followers',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: 2,
        type: 'review',
        message: 'Your review of Bali Beach Resort received 5 likes',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false
      },
      {
        id: 3,
        type: 'recommendation',
        message: 'New destinations matching your interests are available',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount: notifications.filter(n => !n.read).length
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

// Update user activity status
export const updateUserActivity = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        $set: { 
          lastActive: new Date(),
          'statistics.lastLoginDate': new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};