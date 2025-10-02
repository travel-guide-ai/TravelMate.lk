/**
 * Database Schema Test
 * Quick test to verify all schemas are working correctly
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Destination from './models/Destination.js';
import Itinerary from './models/Itinerary.js';
import Review from './models/Review.js';
import ChatConversation from './models/ChatConversation.js';
import { Booking, Activity } from './models/Booking.js';
import Notification from './models/Notification.js';

dotenv.config();

async function testSchemas() {
  console.log('🧪 Testing Database Schemas...');
  
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelmate';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Test schema validation by creating test documents
    const tests = [
      {
        name: 'User Schema',
        test: async () => {
          const user = new User({
            clerkId: 'test_user_schema',
            email: 'test@schema.com',
            profile: { firstName: 'Test', lastName: 'User' }
          });
          await user.validate();
          return true;
        }
      },
      {
        name: 'Destination Schema',
        test: async () => {
          const destination = new Destination({
            name: 'Test Destination',
            slug: 'test-destination',
            category: 'attraction',
            location: {
              type: 'Point',
              coordinates: [80.0, 7.0],
              city: 'Test City',
              province: 'Test Province'
            },
            createdBy: new mongoose.Types.ObjectId()
          });
          await destination.validate();
          return true;
        }
      },
      {
        name: 'Review Schema',
        test: async () => {
          const review = new Review({
            userId: new mongoose.Types.ObjectId(),
            destinationId: new mongoose.Types.ObjectId(),
            rating: 5,
            title: 'Test Review',
            content: 'This is a test review'
          });
          await review.validate();
          return true;
        }
      },
      {
        name: 'Itinerary Schema',
        test: async () => {
          const itinerary = new Itinerary({
            userId: new mongoose.Types.ObjectId(),
            title: 'Test Itinerary',
            duration: 3,
            days: [
              {
                dayNumber: 1,
                destinations: []
              }
            ]
          });
          await itinerary.validate();
          return true;
        }
      },
      {
        name: 'ChatConversation Schema',
        test: async () => {
          const conversation = new ChatConversation({
            userId: new mongoose.Types.ObjectId(),
            sessionId: 'test_session_123',
            messages: [
              {
                role: 'user',
                content: 'Hello, can you help me plan a trip?'
              }
            ]
          });
          await conversation.validate();
          return true;
        }
      },
      {
        name: 'Booking Schema',
        test: async () => {
          const booking = new Booking({
            userId: new mongoose.Types.ObjectId(),
            bookingType: 'accommodation',
            pricing: {
              basePrice: 1000,
              totalPrice: 1200
            },
            payment: {
              method: 'card'
            }
          });
          await booking.validate();
          return true;
        }
      },
      {
        name: 'Notification Schema',
        test: async () => {
          const notification = new Notification({
            recipient: new mongoose.Types.ObjectId(),
            type: 'booking_confirmation',
            title: 'Test Notification',
            message: 'This is a test notification'
          });
          await notification.validate();
          return true;
        }
      }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        await test.test();
        console.log(`✅ ${test.name}: PASSED`);
        passed++;
      } catch (error) {
        console.log(`❌ ${test.name}: FAILED - ${error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

    // Check collections and indexes
    console.log('\n📋 Database Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   📁 ${col.name}`);
    });

    return { passed, failed, total: tests.length };

  } catch (error) {
    console.error('❌ Schema test failed:', error.message);
    return { error: error.message };
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSchemas().then(result => {
    if (result.error) {
      process.exit(1);
    } else if (result.failed > 0) {
      process.exit(1);
    } else {
      console.log('\n🎉 All schema tests passed!');
      process.exit(0);
    }
  }).catch(error => {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  });
}

export default testSchemas;