/**
 * Database Seed Script
 * Populates TravelMate.lk database with sample data for development and testing
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Itinerary from '../models/Itinerary.js';
import Review from '../models/Review.js';
import ChatConversation from '../models/ChatConversation.js';
import { Booking, Activity } from '../models/Booking.js';
import Notification from '../models/Notification.js';

class DatabaseSeeder {
  constructor() {
    this.createdData = {
      users: [],
      destinations: [],
      itineraries: [],
      reviews: [],
      conversations: [],
      bookings: [],
      activities: [],
      notifications: []
    };
  }

  // Seed Users
  async seedUsers() {
    console.log('👥 Seeding users...');
    
    const sampleUsers = [
      {
        clerkId: 'test_user_1',
        email: 'john.doe@example.com',
        emailVerified: true,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          bio: 'Adventure traveler passionate about exploring Sri Lanka',
          location: {
            city: 'Colombo',
            country: 'Sri Lanka',
            coordinates: { lat: 6.9271, lng: 79.8612 }
          },
          interests: ['adventure', 'culture', 'wildlife'],
          travelStyle: 'adventure',
          language: 'en'
        },
        socialProfile: {
          isPublic: true
        },
        statistics: {
          totalDestinationsVisited: 15,
          totalItinerariesCreated: 5,
          totalReviewsWritten: 12
        }
      },
      {
        clerkId: 'test_user_2',
        email: 'sarah.wilson@example.com',
        emailVerified: true,
        profile: {
          firstName: 'Sarah',
          lastName: 'Wilson',
          username: 'sarahwilson',
          bio: 'Cultural enthusiast and food lover',
          location: {
            city: 'Kandy',
            country: 'Sri Lanka',
            coordinates: { lat: 7.2906, lng: 80.6337 }
          },
          interests: ['cultural', 'food', 'nature'],
          travelStyle: 'cultural',
          language: 'en'
        },
        socialProfile: {
          isPublic: true
        },
        statistics: {
          totalDestinationsVisited: 22,
          totalItinerariesCreated: 8,
          totalReviewsWritten: 18
        }
      },
      {
        clerkId: 'test_user_3',
        email: 'mike.chen@example.com',
        emailVerified: true,
        profile: {
          firstName: 'Mike',
          lastName: 'Chen',
          username: 'mikechen',
          bio: 'Budget traveler seeking authentic experiences',
          location: {
            city: 'Galle',
            country: 'Sri Lanka',
            coordinates: { lat: 6.0535, lng: 80.2210 }
          },
          interests: ['budget', 'local_culture', 'beaches'],
          travelStyle: 'budget',
          language: 'en'
        },
        socialProfile: {
          isPublic: true
        },
        statistics: {
          totalDestinationsVisited: 30,
          totalItinerariesCreated: 12,
          totalReviewsWritten: 25
        }
      }
    ];

    try {
      const users = await User.insertMany(sampleUsers);
      this.createdData.users = users;
      console.log(`✅ Created ${users.length} users`);
      return users;
    } catch (error) {
      console.error('❌ Error seeding users:', error.message);
      return [];
    }
  }

  // Seed Destinations
  async seedDestinations() {
    console.log('🏝️ Seeding destinations...');
    
    const sampleDestinations = [
      {
        name: 'Sigiriya Rock Fortress',
        slug: 'sigiriya-rock-fortress',
        category: 'attraction',
        subCategory: 'historical',
        location: {
          type: 'Point',
          coordinates: [80.7603, 7.9569],
          address: 'Sigiriya, Matale District',
          city: 'Dambulla',
          province: 'Central Province'
        },
        description: {
          en: 'Ancient rock fortress and UNESCO World Heritage site with stunning frescoes and gardens.',
          si: 'පුරාණ පර්වත කොටුව සහ යුනෙස්කෝ ලෝක උරුම ස්ථානය.',
          ta: 'பண்டைய பாறை கோட்டை மற்றும் யுனெஸ்கோ உலக பாரம்பரிய தளம்.'
        },
        images: [
          {
            url: '/images/sigiriya-1.jpg',
            alt: 'Sigiriya Rock view',
            caption: 'The magnificent Sigiriya Rock rising from the plains'
          }
        ],
        amenities: ['parking', 'guided_tours', 'restrooms', 'museum'],
        pricing: {
          currency: 'LKR',
          adult: 5000,
          child: 2500,
          foreigner: 6000
        },
        ratings: {
          average: 4.7,
          count: 1250
        },
        tags: ['unesco', 'historical', 'archaeology', 'ancient'],
        featured: true,
        createdBy: null // Will be set after users are created
      },
      {
        name: 'Temple of the Sacred Tooth Relic',
        slug: 'temple-sacred-tooth-relic-kandy',
        category: 'attraction',
        subCategory: 'religious',
        location: {
          type: 'Point',
          coordinates: [80.6337, 7.2906],
          address: 'Sri Dalada Veediya, Kandy',
          city: 'Kandy',
          province: 'Central Province'
        },
        description: {
          en: 'Sacred Buddhist temple housing the relic of Buddha\'s tooth, a major pilgrimage site.',
          si: 'බුදුන් වහන්සේගේ දළදා ධාතුව වැඩ වසන ශුද්ධ වූ බෞද්ධ විහාරය.',
          ta: 'புத்தரின் பல் அெச்சத்தை வைத்திருக்கும் புனித பௌத்த கோவில்.'
        },
        images: [
          {
            url: '/images/dalada-maligawa-1.jpg',
            alt: 'Temple of Sacred Tooth Relic',
            caption: 'The golden roof of the sacred temple'
          }
        ],
        amenities: ['prayer_hall', 'museum', 'guided_tours', 'gift_shop'],
        pricing: {
          currency: 'LKR',
          adult: 2000,
          child: 1000,
          foreigner: 2500
        },
        ratings: {
          average: 4.6,
          count: 980
        },
        tags: ['buddhist', 'temple', 'sacred', 'cultural', 'kandy'],
        featured: true,
        createdBy: null
      },
      {
        name: 'Galle Fort',
        slug: 'galle-fort',
        category: 'attraction',
        subCategory: 'historical',
        location: {
          type: 'Point',
          coordinates: [80.2168, 6.0274],
          address: 'Church Street, Galle Fort',
          city: 'Galle',
          province: 'Southern Province'
        },
        description: {
          en: 'Dutch colonial fort and UNESCO World Heritage site overlooking the Indian Ocean.',
          si: 'ඉන්දියන් සාගරය දෙස බලා සිටින ලන්දේසි යටත් විජිත බලකොටුව.',
          ta: 'இந்தியப் பெருங்கடலைப் பார்க்கும் டச்சு குடியேற்ற கோட்டை.'
        },
        images: [
          {
            url: '/images/galle-fort-1.jpg',
            alt: 'Galle Fort walls',
            caption: 'Historic Dutch fort walls facing the ocean'
          }
        ],
        amenities: ['walking_paths', 'restaurants', 'shops', 'lighthouse'],
        pricing: {
          currency: 'LKR',
          adult: 0, // Free entry
          child: 0,
          foreigner: 0
        },
        ratings: {
          average: 4.5,
          count: 750
        },
        tags: ['dutch', 'colonial', 'unesco', 'fort', 'galle'],
        featured: true,
        createdBy: null
      },
      {
        name: 'Yala National Park',
        slug: 'yala-national-park',
        category: 'attraction',
        subCategory: 'wildlife',
        location: {
          type: 'Point',
          coordinates: [81.5203, 6.3725],
          address: 'Yala National Park, Hambantota',
          city: 'Tissamaharama',
          province: 'Southern Province'
        },
        description: {
          en: 'Premier wildlife park famous for leopards, elephants, and diverse bird species.',
          si: 'කොටියන්, අලි ඇතුන් සහ විවිධ පක්ෂි විශේෂ සඳහා ප්‍රසිද්ධ ප්‍රධාන වනජීවී උද්‍යානය.',
          ta: 'சிறுத்தைகள், யானைகள் மற்றும் பல்வேறு பறவை இனங்களுக்கு பிரபலமான முன்னணி வனவிலங்கு பூங்கா.'
        },
        images: [
          {
            url: '/images/yala-leopard-1.jpg',
            alt: 'Leopard in Yala',
            caption: 'Sri Lankan leopard spotted in Yala National Park'
          }
        ],
        amenities: ['safari_tours', 'visitor_center', 'camping', 'restaurant'],
        pricing: {
          currency: 'LKR',
          adult: 3000,
          child: 1500,
          foreigner: 6000
        },
        ratings: {
          average: 4.4,
          count: 630
        },
        tags: ['wildlife', 'safari', 'leopard', 'elephant', 'national_park'],
        featured: true,
        createdBy: null
      }
    ];

    try {
      // Set creator to first user if available
      if (this.createdData.users.length > 0) {
        sampleDestinations.forEach(dest => {
          dest.createdBy = this.createdData.users[0]._id;
        });
      }

      const destinations = await Destination.insertMany(sampleDestinations);
      this.createdData.destinations = destinations;
      console.log(`✅ Created ${destinations.length} destinations`);
      return destinations;
    } catch (error) {
      console.error('❌ Error seeding destinations:', error.message);
      return [];
    }
  }

  // Seed Reviews
  async seedReviews() {
    console.log('⭐ Seeding reviews...');
    
    if (this.createdData.users.length === 0 || this.createdData.destinations.length === 0) {
      console.warn('⚠️ Skipping reviews - need users and destinations first');
      return [];
    }

    const sampleReviews = [];
    
    // Create reviews for each destination
    this.createdData.destinations.forEach((destination, destIndex) => {
      this.createdData.users.forEach((user, userIndex) => {
        if ((destIndex + userIndex) % 2 === 0) { // Create reviews for about half the combinations
          sampleReviews.push({
            userId: user._id,
            destinationId: destination._id,
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            title: `Amazing experience at ${destination.name}`,
            content: `Had a wonderful time visiting ${destination.name}. The location is stunning and well-maintained. Would definitely recommend to other travelers!`,
            images: [],
            visitDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
            travelType: ['solo', 'couple', 'family', 'friends'][Math.floor(Math.random() * 4)],
            isVerified: Math.random() > 0.3, // 70% verified
            likes: Math.floor(Math.random() * 50),
            moderationStatus: 'approved'
          });
        }
      });
    });

    try {
      const reviews = await Review.insertMany(sampleReviews);
      this.createdData.reviews = reviews;
      console.log(`✅ Created ${reviews.length} reviews`);
      return reviews;
    } catch (error) {
      console.error('❌ Error seeding reviews:', error.message);
      return [];
    }
  }

  // Seed Itineraries
  async seedItineraries() {
    console.log('🗺️ Seeding itineraries...');
    
    if (this.createdData.users.length === 0 || this.createdData.destinations.length === 0) {
      console.warn('⚠️ Skipping itineraries - need users and destinations first');
      return [];
    }

    const sampleItineraries = [
      {
        userId: this.createdData.users[0]._id,
        title: 'Cultural Triangle Adventure',
        description: 'Explore the ancient kingdoms and cultural heritage of Sri Lanka',
        coverImage: '/images/cultural-triangle.jpg',
        duration: 5,
        days: [
          {
            dayNumber: 1,
            date: new Date('2024-12-01'),
            destinations: [{
              destinationId: this.createdData.destinations[0]._id, // Sigiriya
              arrivalTime: '09:00',
              departureTime: '17:00',
              notes: 'Climb early morning to avoid crowds',
              transportMode: 'car'
            }],
            accommodations: [],
            totalBudget: 15000
          }
        ],
        metadata: {
          totalBudget: 75000,
          currency: 'LKR',
          travelStyle: 'mid-range',
          groupSize: 2
        },
        sharing: {
          isPublic: true,
          allowComments: true,
          allowFork: true
        },
        stats: {
          views: 150,
          likes: 24,
          forks: 8,
          comments: 12
        }
      }
    ];

    try {
      const itineraries = await Itinerary.insertMany(sampleItineraries);
      this.createdData.itineraries = itineraries;
      console.log(`✅ Created ${itineraries.length} itineraries`);
      return itineraries;
    } catch (error) {
      console.error('❌ Error seeding itineraries:', error.message);
      return [];
    }
  }

  // Run all seeds
  async seedAll() {
    console.log('🌱 Starting database seeding...');
    
    try {
      // Seed in order due to dependencies
      await this.seedUsers();
      await this.seedDestinations();
      await this.seedReviews();
      await this.seedItineraries();
      
      console.log('\n✅ Database seeding completed successfully!');
      console.log('📊 Created data summary:');
      console.table({
        Users: this.createdData.users.length,
        Destinations: this.createdData.destinations.length,
        Reviews: this.createdData.reviews.length,
        Itineraries: this.createdData.itineraries.length
      });
      
      return this.createdData;
    } catch (error) {
      console.error('❌ Error during seeding:', error.message);
      throw error;
    }
  }

  // Clear all seeded data
  async clearAll() {
    console.log('🧹 Clearing all seeded data...');
    
    try {
      await Promise.all([
        User.deleteMany({}),
        Destination.deleteMany({}),
        Review.deleteMany({}),
        Itinerary.deleteMany({}),
        ChatConversation.deleteMany({}),
        Booking.deleteMany({}),
        Activity.deleteMany({}),
        Notification.deleteMany({})
      ]);
      
      console.log('✅ All data cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error clearing data:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export default DatabaseSeeder;