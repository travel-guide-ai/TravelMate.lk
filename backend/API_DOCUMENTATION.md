# User Profile & Dashboard API Documentation

## Overview
This document describes the backend API endpoints for User Profile and Dashboard functionality in TravelMate.lk.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

---

## Profile Endpoints

### 1. Get User Profile
**GET** `/profile`

Returns the current authenticated user's complete profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "clerkId": "clerk_user_id",
    "email": "user@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "bio": "Travel enthusiast",
      "location": {
        "city": "New York",
        "country": "USA",
        "coordinates": { "lat": 40.7128, "lng": -74.0060 }
      },
      "interests": ["adventure", "culture", "food"],
      "travelStyle": "adventure",
      "avatar": "https://example.com/avatar.jpg"
    },
    "statistics": {
      "totalDestinationsVisited": 15,
      "totalItinerariesCreated": 8,
      "totalReviewsWritten": 12,
      "profileViews": 45,
      "memberSince": "2024-01-01T00:00:00.000Z"
    },
    "socialProfile": {
      "isPublic": true,
      "followersCount": 23,
      "followingCount": 18
    },
    "settings": {
      "emailNotifications": true,
      "pushNotifications": true,
      "privacy": "public",
      "theme": "light",
      "currency": "USD"
    }
  }
}
```

### 2. Update User Profile
**PUT** `/profile`

Updates the current authenticated user's profile information.

**Request Body:**
```json
{
  "profile.bio": "Updated bio",
  "profile.interests": ["adventure", "luxury"],
  "profile.travelStyle": "luxury",
  "settings.emailNotifications": false,
  "settings.theme": "dark"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated profile data */ }
}
```

### 3. Get Public Profile
**GET** `/profile/:userId`

Returns public profile information for a specific user.

**Parameters:**
- `userId` - The MongoDB ObjectId of the user

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "bio": "Travel enthusiast",
      "location": { /* location data */ },
      "interests": ["adventure", "culture"],
      "travelStyle": "adventure",
      "avatar": "https://example.com/avatar.jpg"
    },
    "statistics": { /* public statistics */ },
    "socialProfile": { /* follower counts */ },
    "bookmarks": [ /* public bookmarks */ ]
  }
}
```

### 4. Upload Avatar
**POST** `/profile/avatar`

Updates the user's profile avatar.

**Request Body:**
```json
{
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

### 5. Delete Account
**DELETE** `/profile/account`

Permanently deletes the authenticated user's account.

---

## Dashboard Endpoints

### 1. Get Dashboard Overview
**GET** `/dashboard/overview`

Returns comprehensive dashboard data for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "Travel enthusiast"
      }
    },
    "statistics": {
      "totalDestinations": 15,
      "totalItineraries": 8,
      "totalReviews": 12,
      "profileViews": 45,
      "followersCount": 23,
      "followingCount": 18,
      "memberSince": "2024-01-01T00:00:00.000Z",
      "lastActive": "2024-10-02T06:00:00.000Z"
    },
    "recentActivity": {
      "bookmarks": [ /* recent bookmarked destinations */ ],
      "itineraries": [ /* recent itineraries */ ],
      "reviews": [ /* recent reviews */ ]
    },
    "monthlyActivity": {
      "newBookmarks": 3,
      "newItineraries": 1,
      "newReviews": 2
    },
    "quickActions": [
      { "action": "create_itinerary", "label": "Create New Itinerary", "icon": "map" },
      { "action": "discover_destinations", "label": "Discover Destinations", "icon": "compass" }
    ]
  }
}
```

### 2. Get Travel Analytics
**GET** `/dashboard/analytics`

Returns detailed travel analytics and patterns for the user.

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "destinationsByCountry": { "Japan": 3, "Italy": 2, "France": 1 },
      "destinationsByCategory": { "cultural": 4, "adventure": 2, "urban": 1 },
      "averageRating": "4.2",
      "totalCountriesVisited": 3,
      "favoriteCategories": [
        { "category": "cultural", "count": 4 },
        { "category": "adventure", "count": 2 }
      ],
      "travelScore": 75
    },
    "timeline": [ /* travel timeline data */ ],
    "totalDestinations": 15,
    "totalItineraries": 8
  }
}
```

### 3. Get Personalized Recommendations
**GET** `/dashboard/recommendations`

Returns personalized destination recommendations based on user preferences.

**Response:**
```json
{
  "success": true,
  "data": {
    "forYou": [ /* destinations matching user preferences */ ],
    "trending": [ /* trending destinations */ ],
    "fromFriends": [ /* destinations bookmarked by friends */ ],
    "preferences": {
      "categories": ["adventure", "cultural"],
      "tags": ["nature", "historic", "scenic"],
      "countries": ["Japan", "Italy"]
    }
  }
}
```

### 4. Get Recent Notifications
**GET** `/dashboard/notifications`

Returns recent notifications for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "follower",
        "message": "You have 3 new followers",
        "timestamp": "2024-10-02T05:30:00.000Z",
        "read": false
      }
    ],
    "unreadCount": 2
  }
}
```

### 5. Update User Activity
**POST** `/dashboard/activity`

Updates the user's last active timestamp.

**Response:**
```json
{
  "success": true,
  "message": "Activity updated successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Field 'bio' exceeds maximum length"]
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Enhanced User Model Fields

The User model has been enhanced with the following new fields:

### Profile Fields
- `profile.bio` - User biography (max 500 characters)
- `profile.location` - User location with city, country, and coordinates
- `profile.interests` - Array of user interests
- `profile.travelStyle` - Travel style preference (adventure, luxury, budget, etc.)

### Statistics Fields
- `statistics.totalDestinationsVisited` - Count of visited destinations
- `statistics.totalItinerariesCreated` - Count of created itineraries
- `statistics.totalReviewsWritten` - Count of written reviews
- `statistics.memberSince` - Account creation date
- `statistics.lastLoginDate` - Last login timestamp
- `statistics.profileViews` - Profile view count

### Enhanced Settings
- `settings.smsNotifications` - SMS notification preference
- `settings.twoFactorAuth` - Two-factor authentication status
- `settings.dataSharing` - Data sharing preference
- `settings.theme` - UI theme preference (light/dark/auto)
- `settings.currency` - Preferred currency
- `settings.timeZone` - User timezone

---

## Implementation Notes

1. All endpoints are protected with Clerk authentication middleware
2. Profile updates use dot notation for nested object updates
3. Public profiles respect privacy settings
4. Dashboard data is cached for performance
5. Analytics are computed in real-time based on user data
6. Recommendations use collaborative filtering based on user preferences and social connections