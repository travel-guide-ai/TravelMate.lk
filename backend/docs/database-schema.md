# TravelMate.lk Database Schema Documentation

## Overview
This document provides comprehensive documentation for the TravelMate.lk MongoDB database schema, including optimizations, indexing strategies, and performance considerations.

## Schema Architecture

### 1. User Schema (`users`)

**Purpose**: Store user profiles, social connections, and preferences

**Key Features**:
- Clerk authentication integration
- Social networking capabilities
- Travel preferences and statistics
- Geospatial location support

**Indexes**:
```javascript
// Primary lookups
{ clerkId: 1 }                                    // Unique, authentication
{ email: 1 }                                      // Unique, email lookup
{ 'profile.username': 1 }                         // Sparse, username lookup

// Social features
{ 'socialProfile.followers': 1 }                  // Social queries
{ 'socialProfile.following': 1 }                  // Social queries

// Geospatial
{ 'profile.location.coordinates': '2dsphere' }    // Location-based matching

// Performance
{ 'profile.interests': 1 }                        // Interest matching
{ 'profile.travelStyle': 1 }                      // Travel style filtering
{ lastActive: -1 }                                // Active users
{ createdAt: -1 }                                 // Recent users

// Analytics
{ 'statistics.totalDestinationsVisited': -1 }     // Leaderboards
{ 'statistics.totalItinerariesCreated': -1 }      // Leaderboards

// Compound indexes
{ 'socialProfile.isPublic': 1, 'profile.travelStyle': 1 }
{ 'profile.location.city': 1, 'profile.travelStyle': 1 }
```

**Sample Document**:
```javascript
{
  _id: ObjectId,
  clerkId: "user_2abc123def456",
  email: "john.doe@example.com",
  emailVerified: true,
  profile: {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    bio: "Adventure traveler exploring Sri Lanka",
    location: {
      city: "Colombo",
      country: "Sri Lanka",
      coordinates: { lat: 6.9271, lng: 79.8612 }
    },
    interests: ["adventure", "culture", "wildlife"],
    travelStyle: "adventure"
  },
  socialProfile: {
    isPublic: true,
    followers: [ObjectId, ...],
    following: [ObjectId, ...]
  },
  statistics: {
    totalDestinationsVisited: 15,
    totalItinerariesCreated: 5,
    totalReviewsWritten: 12
  }
}
```

### 2. Destination Schema (`destinations`)

**Purpose**: Store travel destinations, attractions, hotels, restaurants, and activities

**Key Features**:
- Geospatial location support
- Multi-language descriptions
- Rating and review aggregation
- Rich media support

**Indexes**:
```javascript
// Geospatial
{ location: '2dsphere' }                          // Location-based searches

// Text search
{
  name: 'text',
  'description.en': 'text',
  'description.si': 'text', 
  'description.ta': 'text',
  tags: 'text'
}

// Core filtering
{ category: 1, 'ratings.average': -1 }            // Category with rating
{ featured: -1, createdAt: -1 }                   // Featured destinations
{ isActive: 1, category: 1 }                      // Active by category
{ 'location.city': 1, category: 1 }               // City-based filtering
{ 'location.province': 1, category: 1 }           // Province-based filtering

// Advanced filtering
{ tags: 1, 'ratings.average': -1 }                // Tag-based with rating
{ 'pricing.adult': 1, category: 1 }               // Price-based filtering
{ amenities: 1, category: 1 }                     // Amenity-based filtering

// Performance
{ slug: 1 }                                       // URL lookup
{ 'ratings.count': -1 }                           // Popular destinations
{ createdBy: 1, createdAt: -1 }                   // User's destinations

// Compound indexes
{ 'location.city': 1, category: 1, 'ratings.average': -1 }
{ isActive: 1, featured: 1, 'ratings.average': -1 }
```

**Sample Document**:
```javascript
{
  _id: ObjectId,
  name: "Sigiriya Rock Fortress",
  slug: "sigiriya-rock-fortress",
  category: "attraction",
  subCategory: "historical",
  location: {
    type: "Point",
    coordinates: [80.7603, 7.9569],
    address: "Sigiriya, Matale District",
    city: "Dambulla",
    province: "Central Province"
  },
  description: {
    en: "Ancient rock fortress and UNESCO World Heritage site...",
    si: "පුරාණ පර්වත කොටුව...",
    ta: "பண்டைய பாறை கோட்டை..."
  },
  pricing: {
    currency: "LKR",
    adult: 5000,
    child: 2500,
    foreigner: 6000
  },
  ratings: {
    average: 4.7,
    count: 1250
  },
  tags: ["unesco", "historical", "archaeology"],
  featured: true,
  isActive: true
}
```

### 3. Itinerary Schema (`itineraries`)

**Purpose**: Store user-created travel itineraries with embedded day plans

**Key Features**:
- Embedded day-by-day planning
- Budget tracking
- Social sharing capabilities
- Fork and collaboration support

**Indexes**:
```javascript
// User access
{ userId: 1, createdAt: -1 }                      // User's itineraries

// Public discovery
{ 'sharing.isPublic': 1, createdAt: -1 }          // Public itineraries
{ 'sharing.isPublic': 1, 'stats.views': -1 }     // Popular itineraries
{ 'sharing.isPublic': 1, 'stats.likes': -1 }     // Most liked

// Filtering
{ duration: 1, 'sharing.isPublic': 1 }            // Duration-based
{ 'metadata.travelStyle': 1, 'sharing.isPublic': 1 } // Style filtering
{ 'metadata.totalBudget': 1, 'sharing.isPublic': 1 } // Budget filtering

// Text search
{ title: 'text', description: 'text' }

// Compound indexes
{ 'sharing.isPublic': 1, 'metadata.travelStyle': 1, duration: 1 }
{ userId: 1, 'sharing.isPublic': 1, updatedAt: -1 }
```

### 4. Review Schema (`reviews`)

**Purpose**: Store user reviews and ratings for destinations

**Key Features**:
- Rating aggregation
- Moderation workflow
- Helpfulness scoring
- Travel type categorization

**Indexes**:
```javascript
// Destination reviews
{ destinationId: 1, createdAt: -1 }               // Latest reviews
{ destinationId: 1, rating: -1 }                  // Reviews by rating
{ destinationId: 1, moderationStatus: 1, createdAt: -1 } // Approved reviews

// User reviews
{ userId: 1, createdAt: -1 }                      // User's reviews
{ userId: 1, moderationStatus: 1, createdAt: -1 } // User's approved reviews

// Moderation
{ moderationStatus: 1, createdAt: 1 }             // Moderation queue

// Quality metrics
{ isVerified: 1, rating: -1 }                     // Verified reviews
{ likes: -1, moderationStatus: 1 }                // Most helpful
{ visitDate: -1, moderationStatus: 1 }            // Recent visits

// Analytics
{ travelType: 1, destinationId: 1 }               // Travel type analysis

// Text search
{ title: 'text', content: 'text' }

// Compound indexes
{ destinationId: 1, moderationStatus: 1, rating: -1, createdAt: -1 }
{ destinationId: 1, travelType: 1, rating: -1 }
```

### 5. ChatConversation Schema (`chatconversations`)

**Purpose**: Store AI chatbot conversations and analytics

**Key Features**:
- Message history with metadata
- Context tracking
- AI model performance metrics
- Automatic conversation cleanup

**Indexes**:
```javascript
// Session management
{ userId: 1, createdAt: -1 }                      // User's conversations
{ sessionId: 1 }                                  // Session lookup
{ status: 1, lastActivity: -1 }                   // Active conversations

// Analytics
{ 'context.currentTopic': 1, createdAt: -1 }     // Topic analytics
{ 'metadata.platform': 1, createdAt: -1 }        // Platform analytics
{ 'metadata.source': 1, createdAt: -1 }          // Source analytics

// Performance
{ isArchived: 1, updatedAt: -1 }                  // Archived conversations
{ 'aiModel.provider': 1, 'aiModel.model': 1 }    // Model tracking

// Text search
{ title: 'text', 'messages.content': 'text' }

// TTL index
{ createdAt: 1 } // expireAfterSeconds: 365 * 24 * 60 * 60

// Compound indexes
{ userId: 1, status: 1, lastActivity: -1 }
{ 'context.currentTopic': 1, status: 1, 'stats.userSatisfactionScore': -1 }
{ 'metadata.platform': 1, 'metadata.source': 1, createdAt: -1 }
```

### 6. Booking Schema (`bookings`)

**Purpose**: Store travel bookings and reservations

**Key Features**:
- Multi-type booking support
- Payment tracking
- Cancellation management
- Analytics and reporting

**Indexes**:
```javascript
// User bookings
{ userId: 1, createdAt: -1 }                      // User's bookings
{ userId: 1, status: 1, 'details.checkInDate': -1 } // User's upcoming bookings

// Availability queries
{ destinationId: 1, 'details.checkInDate': 1 }   // Destination availability
{ status: 1, 'details.checkInDate': 1 }           // Status-based queries

// Operations
{ confirmationCode: 1 }                           // Booking lookup
{ 'payment.status': 1, createdAt: -1 }            // Payment processing
{ bookingType: 1, status: 1 }                     // Type-based analytics

// Compound indexes
{ userId: 1, status: 1, 'details.checkInDate': -1 }
{ destinationId: 1, 'details.checkInDate': 1, status: 1 }
{ 'payment.status': 1, createdAt: -1 }
```

### 7. Notification Schema (`notifications`)

**Purpose**: Store user notifications across multiple channels

**Key Features**:
- Multi-channel delivery tracking
- Smart grouping
- Performance optimization
- Automatic cleanup

**Indexes**:
```javascript
// Primary queries
{ recipient: 1, status: 1, createdAt: -1 }        // User notifications
{ recipient: 1, type: 1, createdAt: -1 }          // Type filtering

// Performance
{ scheduledFor: 1, status: 1 }                    // Scheduled notifications
{ groupKey: 1, recipient: 1 }                     // Grouping queries
{ priority: 1, status: 1, createdAt: -1 }         // Priority sorting

// TTL index
{ expiresAt: 1 } // expireAfterSeconds: 0

// Compound indexes
{ recipient: 1, status: 1, priority: 1, createdAt: -1 }
{ type: 1, createdAt: -1, status: 1 }
```

## Performance Optimization Strategies

### 1. Index Optimization
- **Compound Indexes**: Designed for common query patterns
- **Background Creation**: All indexes created with `background: true`
- **Selective Indexing**: Sparse indexes for optional fields
- **Text Search**: Weighted text indexes for relevance

### 2. Query Optimization
- **Projection**: Limit returned fields for large documents
- **Aggregation**: Use aggregation pipelines for complex analytics
- **Range Queries**: Prefer range queries over skip/limit for pagination
- **Geospatial**: Optimize location-based queries with 2dsphere indexes

### 3. Document Design
- **Embedding**: Embed related data to reduce joins
- **Array Limits**: Monitor array sizes to prevent large documents
- **TTL Indexes**: Automatic cleanup for temporary data
- **Denormalization**: Strategic duplication for performance

### 4. Connection Management
- **Pool Size**: Optimized connection pool settings
- **Write Concern**: Appropriate write concern levels
- **Read Preferences**: Load balancing with read preferences

## Migration and Seeding

### Running Migrations
```bash
# Run all migrations
node dbcli.js migrate

# Run migrations up to specific version
node dbcli.js migrate --version 1.2.0

# Rollback all migrations
node dbcli.js rollback
```

### Running Seeds
```bash
# Seed all data
node dbcli.js seed

# Seed specific collections
node dbcli.js seed:users
node dbcli.js seed:destinations

# Clear all seeded data
node dbcli.js seed:clear
```

### Database Management
```bash
# Check database status
node dbcli.js status

# List all indexes
node dbcli.js indexes

# Show collection statistics
node dbcli.js stats
```

## Monitoring and Maintenance

### Performance Monitoring
```javascript
// Enable profiling for slow queries
db.setProfilingLevel(2, { slowms: 100 })

// Check index usage
db.destinations.aggregate([{ $indexStats: {} }])

// Analyze query performance
db.destinations.explain("executionStats").find(query)
```

### Index Maintenance
```javascript
// Check index sizes
db.destinations.totalIndexSize()

// Rebuild indexes if needed
db.destinations.reIndex()

// Monitor index hit ratios
db.runCommand({ collStats: "destinations", indexDetails: true })
```

### Storage Optimization
```javascript
// Collection statistics
db.destinations.stats()

// Storage analysis
db.runCommand({ collStats: "destinations" })

// Data size monitoring
db.stats()
```

## Security Considerations

### Access Control
- User data isolation through query filters
- Authentication required for all operations
- Input validation and sanitization

### Data Privacy
- Sensitive data exclusion in projections
- Privacy settings enforcement
- GDPR compliance considerations

### Performance Security
- Query timeout limits
- Resource usage monitoring
- Rate limiting implementation

## Scalability Planning

### Horizontal Scaling
- Sharding strategy for large collections
- Replica set configuration
- Read/write splitting

### Vertical Scaling
- Memory optimization
- CPU-intensive operation optimization
- Storage performance tuning

### Caching Strategy
- Redis integration for frequently accessed data
- Application-level caching
- Query result caching

This schema design provides a solid foundation for TravelMate.lk's data requirements while ensuring optimal performance, scalability, and maintainability.