#!/usr/bin/env node

/**
 * Database Management CLI
 * Command-line interface for running migrations, seeds, and database operations
 */

import mongoose from 'mongoose';
import DatabaseMigration from './migrations/DatabaseMigration.js';
import DatabaseSeeder from './seeds/DatabaseSeeder.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class DatabaseCLI {
  constructor() {
    this.migration = new DatabaseMigration();
    this.seeder = new DatabaseSeeder();
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelmate';
      await mongoose.connect(mongoUri);
      console.log('🔗 Connected to MongoDB');
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return false;
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }

  printHelp() {
    console.log(`
🗄️  TravelMate.lk Database Management CLI

Usage: node dbcli.js <command> [options]

Commands:
  migrate                     Run all migrations
  migrate --version <ver>     Run migrations up to specific version
  rollback                    Rollback all migrations
  
  seed                        Run all seeds
  seed:users                  Seed users only
  seed:destinations           Seed destinations only
  seed:clear                  Clear all seeded data
  
  status                      Check database status
  indexes                     List all indexes
  stats                       Show collection statistics
  
  help                        Show this help message

Examples:
  node dbcli.js migrate
  node dbcli.js seed
  node dbcli.js status
  node dbcli.js rollback
    `);
  }

  async runCommand(command, args = []) {
    const connected = await this.connect();
    if (!connected) return;

    try {
      switch (command) {
        case 'migrate':
          const version = args.includes('--version') ? args[args.indexOf('--version') + 1] : null;
          await this.migration.runMigrations(version);
          break;

        case 'rollback':
          await this.migration.rollbackMigrations();
          break;

        case 'seed':
          await this.seeder.seedAll();
          break;

        case 'seed:users':
          await this.seeder.seedUsers();
          break;

        case 'seed:destinations':
          await this.seeder.seedDestinations();
          break;

        case 'seed:clear':
          await this.seeder.clearAll();
          break;

        case 'status':
          await this.migration.checkDatabaseState();
          break;

        case 'indexes':
          await this.listIndexes();
          break;

        case 'stats':
          await this.showStats();
          break;

        case 'help':
        default:
          this.printHelp();
          break;
      }
    } catch (error) {
      console.error('❌ Command failed:', error.message);
    } finally {
      await this.disconnect();
    }
  }

  async listIndexes() {
    console.log('📋 Listing all database indexes...');
    
    try {
      const collections = await mongoose.connection.db.collections();
      
      for (const collection of collections) {
        const indexes = await collection.indexes();
        console.log(`\n📁 Collection: ${collection.collectionName}`);
        
        indexes.forEach((index, i) => {
          console.log(`  ${i + 1}. ${index.name}`);
          console.log(`     Keys: ${JSON.stringify(index.key)}`);
          if (index.unique) console.log(`     Unique: true`);
          if (index.sparse) console.log(`     Sparse: true`);
          if (index.background) console.log(`     Background: true`);
        });
      }
    } catch (error) {
      console.error('❌ Error listing indexes:', error.message);
    }
  }

  async showStats() {
    console.log('📊 Database Statistics...');
    
    try {
      const collections = await mongoose.connection.db.collections();
      const stats = [];
      
      for (const collection of collections) {
        const collStats = await collection.stats();
        stats.push({
          Collection: collection.collectionName,
          Documents: collStats.count,
          'Storage Size': `${Math.round(collStats.storageSize / 1024)} KB`,
          'Index Size': `${Math.round(collStats.totalIndexSize / 1024)} KB`,
          Indexes: collStats.nindexes
        });
      }
      
      console.table(stats);
      
      // Overall database stats
      const dbStats = await mongoose.connection.db.stats();
      console.log('\n🗄️ Database Overview:');
      console.log(`  Total Collections: ${dbStats.collections}`);
      console.log(`  Total Documents: ${dbStats.objects}`);
      console.log(`  Data Size: ${Math.round(dbStats.dataSize / 1024 / 1024)} MB`);
      console.log(`  Storage Size: ${Math.round(dbStats.storageSize / 1024 / 1024)} MB`);
      console.log(`  Index Size: ${Math.round(dbStats.indexSize / 1024 / 1024)} MB`);
      
    } catch (error) {
      console.error('❌ Error getting statistics:', error.message);
    }
  }
}

// CLI Entry Point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new DatabaseCLI();
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  if (!command) {
    cli.printHelp();
    process.exit(1);
  }
  
  cli.runCommand(command, args).catch(error => {
    console.error('❌ CLI Error:', error.message);
    process.exit(1);
  });
}

export default DatabaseCLI;