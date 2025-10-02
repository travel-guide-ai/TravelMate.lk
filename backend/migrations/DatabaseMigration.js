/**
 * Database Migration Script
 * Creates all indexes and optimizations for TravelMate.lk
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Itinerary from '../models/Itinerary.js';
import Review from '../models/Review.js';
import ChatConversation from '../models/ChatConversation.js';
import { Booking, Activity } from '../models/Booking.js';
import Notification from '../models/Notification.js';

class DatabaseMigration {
  constructor() {
    this.migrations = [
      { version: '1.0.0', name: 'Initial Schema Setup', handler: this.migration_v1_0_0 },
      { version: '1.1.0', name: 'Performance Indexes', handler: this.migration_v1_1_0 },
      { version: '1.2.0', name: 'Geospatial Optimization', handler: this.migration_v1_2_0 },
      { version: '1.3.0', name: 'Text Search Indexes', handler: this.migration_v1_3_0 },
      { version: '1.4.0', name: 'Analytics Indexes', handler: this.migration_v1_4_0 }
    ];
  }

  // Version 1.0.0 - Initial schema setup
  async migration_v1_0_0() {
    console.log('🚀 Running migration v1.0.0: Initial Schema Setup');
    
    // Ensure all collections exist
    const collections = ['users', 'destinations', 'itineraries', 'reviews', 'chatconversations', 'bookings', 'activities', 'notifications'];
    
    for (const collectionName of collections) {
      try {
        await mongoose.connection.db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`⚠️  Collection ${collectionName} already exists`);
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }
    
    return { success: true, message: 'Initial schema setup completed' };
  }

  // Version 1.1.0 - Performance indexes
  async migration_v1_1_0() {
    console.log('🚀 Running migration v1.1.0: Performance Indexes');
    
    const indexOperations = [];

    // User indexes
    indexOperations.push(
      User.collection.createIndex({ clerkId: 1 }, { unique: true, background: true }),
      User.collection.createIndex({ email: 1 }, { unique: true, background: true }),
      User.collection.createIndex({ 'profile.username': 1 }, { sparse: true, background: true }),
      User.collection.createIndex({ lastActive: -1 }, { background: true })
    );

    // Destination indexes
    indexOperations.push(
      Destination.collection.createIndex({ slug: 1 }, { unique: true, background: true }),
      Destination.collection.createIndex({ category: 1, 'ratings.average': -1 }, { background: true }),
      Destination.collection.createIndex({ isActive: 1, featured: 1 }, { background: true })
    );

    // Itinerary indexes
    indexOperations.push(
      Itinerary.collection.createIndex({ userId: 1, createdAt: -1 }, { background: true }),
      Itinerary.collection.createIndex({ 'sharing.isPublic': 1, 'stats.views': -1 }, { background: true })
    );

    // Review indexes
    indexOperations.push(
      Review.collection.createIndex({ destinationId: 1, createdAt: -1 }, { background: true }),
      Review.collection.createIndex({ userId: 1, moderationStatus: 1 }, { background: true })
    );

    try {
      await Promise.all(indexOperations);
      console.log('✅ Performance indexes created successfully');
      return { success: true, message: 'Performance indexes completed' };
    } catch (error) {
      console.error('❌ Error creating performance indexes:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Version 1.2.0 - Geospatial optimization
  async migration_v1_2_0() {
    console.log('🚀 Running migration v1.2.0: Geospatial Optimization');
    
    try {
      // Destination geospatial index
      await Destination.collection.createIndex(
        { location: '2dsphere' },
        { background: true }
      );

      // User location index
      await User.collection.createIndex(
        { 'profile.location.coordinates': '2dsphere' },
        { sparse: true, background: true }
      );

      console.log('✅ Geospatial indexes created successfully');
      return { success: true, message: 'Geospatial optimization completed' };
    } catch (error) {
      console.error('❌ Error creating geospatial indexes:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Version 1.3.0 - Text search indexes
  async migration_v1_3_0() {
    console.log('🚀 Running migration v1.3.0: Text Search Indexes');
    
    try {
      // Destination text search
      await Destination.collection.createIndex(
        {
          name: 'text',
          'description.en': 'text',
          'description.si': 'text',
          'description.ta': 'text',
          tags: 'text'
        },
        {
          weights: {
            name: 10,
            'description.en': 5,
            'description.si': 5,
            'description.ta': 5,
            tags: 3
          },
          background: true
        }
      );

      // Itinerary text search
      await Itinerary.collection.createIndex(
        {
          title: 'text',
          description: 'text'
        },
        {
          weights: { title: 10, description: 5 },
          background: true
        }
      );

      // Review text search
      await Review.collection.createIndex(
        {
          title: 'text',
          content: 'text'
        },
        {
          weights: { title: 8, content: 3 },
          background: true
        }
      );

      console.log('✅ Text search indexes created successfully');
      return { success: true, message: 'Text search optimization completed' };
    } catch (error) {
      console.error('❌ Error creating text search indexes:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Version 1.4.0 - Analytics indexes
  async migration_v1_4_0() {
    console.log('🚀 Running migration v1.4.0: Analytics Indexes');
    
    const analyticsIndexes = [];

    try {
      // Compound indexes for analytics
      analyticsIndexes.push(
        // User analytics
        User.collection.createIndex({
          'profile.travelStyle': 1,
          'statistics.totalDestinationsVisited': -1
        }, { background: true }),

        // Destination analytics
        Destination.collection.createIndex({
          'location.city': 1,
          category: 1,
          'ratings.average': -1
        }, { background: true }),

        // Booking analytics
        Booking.collection.createIndex({
          bookingType: 1,
          status: 1,
          createdAt: -1
        }, { background: true }),

        // Chat analytics
        ChatConversation.collection.createIndex({
          'metadata.platform': 1,
          'metadata.source': 1,
          createdAt: -1
        }, { background: true })
      );

      await Promise.all(analyticsIndexes);
      console.log('✅ Analytics indexes created successfully');
      return { success: true, message: 'Analytics optimization completed' };
    } catch (error) {
      console.error('❌ Error creating analytics indexes:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Run all migrations
  async runMigrations(targetVersion = null) {
    console.log('🚀 Starting database migrations...');
    const results = [];

    for (const migration of this.migrations) {
      if (targetVersion && migration.version > targetVersion) {
        break;
      }

      try {
        console.log(`\n📦 Migration ${migration.version}: ${migration.name}`);
        const result = await migration.handler.call(this);
        results.push({ ...migration, result });
        
        if (result.success) {
          console.log(`✅ Migration ${migration.version} completed successfully`);
        } else {
          console.error(`❌ Migration ${migration.version} failed:`, result.error);
          break; // Stop on first failure
        }
      } catch (error) {
        console.error(`❌ Migration ${migration.version} threw error:`, error.message);
        results.push({ ...migration, result: { success: false, error: error.message } });
        break;
      }
    }

    return results;
  }

  // Rollback migrations (drop indexes)
  async rollbackMigrations() {
    console.log('🔄 Rolling back database migrations...');
    
    try {
      // Get all collections
      const collections = await mongoose.connection.db.collections();
      
      for (const collection of collections) {
        const indexes = await collection.indexes();
        
        // Drop all indexes except _id
        for (const index of indexes) {
          if (index.name !== '_id_') {
            try {
              await collection.dropIndex(index.name);
              console.log(`🗑️  Dropped index: ${collection.collectionName}.${index.name}`);
            } catch (error) {
              console.warn(`⚠️  Could not drop index ${collection.collectionName}.${index.name}:`, error.message);
            }
          }
        }
      }
      
      console.log('✅ Migration rollback completed');
      return { success: true };
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Check current database state
  async checkDatabaseState() {
    console.log('🔍 Checking database state...');
    
    const state = {
      collections: {},
      totalIndexes: 0,
      totalDocuments: 0
    };

    try {
      const collections = await mongoose.connection.db.collections();
      
      for (const collection of collections) {
        const stats = await collection.stats();
        const indexes = await collection.indexes();
        
        state.collections[collection.collectionName] = {
          documents: stats.count,
          indexes: indexes.length,
          indexNames: indexes.map(idx => idx.name),
          storageSize: stats.storageSize,
          indexSize: stats.totalIndexSize
        };
        
        state.totalIndexes += indexes.length;
        state.totalDocuments += stats.count;
      }
      
      console.log('📊 Database state:');
      console.table(state.collections);
      console.log(`📈 Total documents: ${state.totalDocuments}`);
      console.log(`📈 Total indexes: ${state.totalIndexes}`);
      
      return state;
    } catch (error) {
      console.error('❌ Error checking database state:', error.message);
      return { error: error.message };
    }
  }
}

export default DatabaseMigration;