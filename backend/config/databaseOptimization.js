/**
 * Database Schema Design & Optimization Guide
 * TravelMate.lk - Comprehensive MongoDB Schema Optimization
 */

// =============================================================================
// INDEX STRATEGY OVERVIEW
// =============================================================================

/*
1. USER SCHEMA OPTIMIZATION:
   - Primary lookups: clerkId, email, username
   - Social features: followers, following arrays
   - Geospatial: location.coordinates (2dsphere)
   - Filtering: travelStyle, interests, location
   - Performance: lastActive, statistics for leaderboards

2. DESTINATION SCHEMA OPTIMIZATION:
   - Geospatial: location (2dsphere) for radius searches
   - Text search: name, description fields in multiple languages
   - Filtering: category, city, province, ratings
   - Performance: featured, isActive, pricing ranges
   - SEO: slug for URL-based lookups

3. ITINERARY SCHEMA OPTIMIZATION:
   - User access: userId with creation date
   - Public discovery: isPublic with views/likes sorting
   - Filtering: duration, travelStyle, budget
   - Search: title and description text search
   - Performance: sharing settings with statistics

4. REVIEW SCHEMA OPTIMIZATION:
   - Destination reviews: destinationId with rating/date
   - User reviews: userId with moderation status
   - Moderation: status with creation date for queues
   - Quality: verified reviews, helpfulness scores
   - Analytics: travel type, visit date patterns

5. CHAT CONVERSATION OPTIMIZATION:
   - Session management: sessionId and userId lookups
   - Analytics: platform, source, topic tracking
   - Performance: status with activity for active chats
   - AI metrics: model tracking and satisfaction scores
   - Cleanup: TTL index for automatic archival

6. BOOKING SCHEMA OPTIMIZATION:
   - User bookings: userId with date sorting
   - Availability: destination with check-in dates
   - Status tracking: booking status with dates
   - Payment processing: payment status with transactions
   - Reporting: booking type and source analytics
*/

// =============================================================================
// COMPOUND INDEX STRATEGIES
// =============================================================================

const indexStrategies = {
  // High-performance compound indexes for common queries
  userQueries: [
    { 'socialProfile.isPublic': 1, 'profile.travelStyle': 1 },
    { 'profile.location.city': 1, 'profile.travelStyle': 1 },
    { 'profile.interests': 1, lastActive: -1 },
    { clerkId: 1, 'socialProfile.isPublic': 1 }
  ],

  destinationQueries: [
    { 'location.city': 1, category: 1, 'ratings.average': -1 },
    { isActive: 1, featured: 1, 'ratings.average': -1 },
    { category: 1, 'pricing.adult': 1, 'ratings.average': -1 },
    { tags: 1, 'location.province': 1, isActive: 1 }
  ],

  itineraryQueries: [
    { 'sharing.isPublic': 1, 'metadata.travelStyle': 1, duration: 1 },
    { userId: 1, 'sharing.isPublic': 1, updatedAt: -1 },
    { 'sharing.isPublic': 1, 'stats.views': -1, createdAt: -1 }
  ],

  reviewQueries: [
    { destinationId: 1, moderationStatus: 1, rating: -1, createdAt: -1 },
    { userId: 1, moderationStatus: 1, createdAt: -1 },
    { destinationId: 1, travelType: 1, rating: -1 }
  ],

  chatQueries: [
    { userId: 1, status: 1, lastActivity: -1 },
    { 'context.currentTopic': 1, status: 1, 'stats.userSatisfactionScore': -1 },
    { 'metadata.platform': 1, 'metadata.source': 1, createdAt: -1 }
  ],

  bookingQueries: [
    { userId: 1, status: 1, 'details.checkInDate': -1 },
    { destinationId: 1, 'details.checkInDate': 1, status: 1 },
    { 'payment.status': 1, createdAt: -1 }
  ]
};

// =============================================================================
// PERFORMANCE OPTIMIZATION RECOMMENDATIONS
// =============================================================================

const optimizationRecommendations = {
  // Memory and CPU optimization
  memoryOptimization: {
    // Use projection to limit returned fields
    userProjection: {
      sensitiveFields: { exclude: ['clerkId', 'settings', 'socialProfile.followers'] },
      publicProfile: { include: ['profile', 'statistics', 'avatar'] },
      basicInfo: { include: ['profile.firstName', 'profile.lastName', 'avatar'] }
    },

    // Limit array sizes to prevent large documents
    arrayLimits: {
      followers: 10000, // Consider separate collection if exceeded
      bookmarks: 1000,
      itineraries: 500,
      reviews: 100 // Use pagination for user reviews
    }
  },

  // Query optimization patterns
  queryOptimization: {
    // Use aggregation for complex analytics
    destinationStats: `
      db.destinations.aggregate([
        { $match: { isActive: true } },
        { $group: { 
          _id: "$category", 
          count: { $sum: 1 },
          avgRating: { $avg: "$ratings.average" }
        }}
      ])
    `,

    // Efficient pagination with range queries
    pagination: `
      // Instead of skip/limit for large datasets
      db.destinations.find({ _id: { $gt: lastId } }).limit(20)
    `,

    // Geospatial optimization
    nearbySearch: `
      db.destinations.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: 10000 // 10km
          }
        },
        category: "restaurant"
      })
    `
  },

  // Index maintenance
  indexMaintenance: {
    // Monitor index usage
    monitoring: `
      db.destinations.aggregate([{ $indexStats: {} }])
    `,

    // Remove unused indexes
    cleanup: `
      // Check index hit ratios
      db.destinations.getIndexes()
      db.runCommand({ collStats: "destinations", indexDetails: true })
    `,

    // Background index creation
    backgroundIndexing: `
      db.destinations.createIndex(
        { "location.city": 1, "ratings.average": -1 },
        { background: true }
      )
    `
  }
};

// =============================================================================
// AGGREGATION PIPELINE TEMPLATES
// =============================================================================

const aggregationPipelines = {
  // Popular destinations by city
  popularDestinationsByCity: [
    { $match: { isActive: true } },
    { $group: {
      _id: "$location.city",
      count: { $sum: 1 },
      avgRating: { $avg: "$ratings.average" },
      destinations: { $push: {
        name: "$name",
        category: "$category",
        rating: "$ratings.average"
      }}
    }},
    { $sort: { avgRating: -1, count: -1 } }
  ],

  // User engagement statistics
  userEngagementStats: [
    { $match: { lastActive: { $gte: new Date(Date.now() - 30*24*60*60*1000) } }},
    { $group: {
      _id: "$profile.travelStyle",
      activeUsers: { $sum: 1 },
      totalItineraries: { $sum: "$statistics.totalItinerariesCreated" },
      totalReviews: { $sum: "$statistics.totalReviewsWritten" }
    }},
    { $sort: { activeUsers: -1 } }
  ],

  // Destination recommendation engine
  destinationRecommendations: [
    { $match: { isActive: true, "ratings.average": { $gte: 4.0 } }},
    { $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "destinationId",
      as: "recentReviews"
    }},
    { $addFields: {
      recentReviewCount: { $size: "$recentReviews" },
      popularityScore: {
        $add: [
          { $multiply: ["$ratings.average", 0.4] },
          { $multiply: ["$ratings.count", 0.3] },
          { $multiply: ["$recentReviewCount", 0.3] }
        ]
      }
    }},
    { $sort: { popularityScore: -1 } },
    { $limit: 20 }
  ]
};

// =============================================================================
// DATABASE CONFIGURATION RECOMMENDATIONS
// =============================================================================

const databaseConfig = {
  // Connection pool settings
  connectionPool: {
    maxPoolSize: 50,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 5000
  },

  // Write concern for different operations
  writeConcern: {
    highImportance: { w: "majority", j: true }, // bookings, payments
    medium: { w: 1, j: true }, // reviews, itineraries
    lowImportance: { w: 1 } // analytics, logs
  },

  // Read preferences
  readPreference: {
    analytics: "secondary", // Allow eventual consistency
    userFacing: "primary", // Require immediate consistency
    search: "secondaryPreferred" // Balance load
  }
};

// =============================================================================
// MONITORING AND ALERTS
// =============================================================================

const monitoringQueries = {
  // Slow query detection
  slowQueries: `
    db.setProfilingLevel(2, { slowms: 100 })
    db.system.profile.find().sort({ ts: -1 }).limit(5)
  `,

  // Index efficiency
  indexEfficiency: `
    db.destinations.explain("executionStats").find({
      category: "restaurant",
      "location.city": "Colombo"
    })
  `,

  // Collection statistics
  collectionStats: `
    db.destinations.stats()
    db.users.stats()
    db.reviews.stats()
  `,

  // Storage optimization
  storageAnalysis: `
    db.runCommand({ collStats: "destinations" })
    db.destinations.totalIndexSize()
    db.destinations.dataSize()
  `
};

export {
  indexStrategies,
  optimizationRecommendations,
  aggregationPipelines,
  databaseConfig,
  monitoringQueries
};