import mongoose from "mongoose";

// Individual message schema
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    tokens: Number,
    model: String,
    processingTime: Number, // in milliseconds
    intent: String, // detected user intent
    entities: [String], // extracted entities (destinations, dates, etc.)
    confidence: Number // AI confidence score
  }
}, { _id: true });

// Main conversation schema
const chatConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sessionId: {
    type: String,
    required: true
    // index: true // Removed - explicit index created below
  },
  title: {
    type: String,
    default: "New Conversation"
  },
  // Conversation context and state
  context: {
    currentTopic: {
      type: String,
      enum: ['destinations', 'itinerary_planning', 'recommendations', 'bookings', 'general', 'support']
    },
    userPreferences: {
      budget: String,
      travelStyle: String,
      interests: [String],
      duration: Number,
      groupSize: Number,
      preferredLocations: [String]
    },
    activeItinerary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary"
    },
    referencedDestinations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination"
    }]
  },
  // Conversation messages
  messages: [messageSchema],
  // Conversation metadata
  metadata: {
    language: {
      type: String,
      default: 'en'
    },
    platform: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    source: {
      type: String,
      enum: ['chat_widget', 'planning_assistant', 'support', 'recommendation_engine'],
      default: 'chat_widget'
    },
    userAgent: String,
    ipAddress: String
  },
  // Conversation statistics
  stats: {
    messageCount: {
      type: Number,
      default: 0
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    avgResponseTime: {
      type: Number,
      default: 0
    },
    userSatisfactionScore: {
      type: Number,
      min: 1,
      max: 5
    },
    resolvedIssues: {
      type: Number,
      default: 0
    },
    conversationDuration: Number // in minutes
  },
  // Conversation status and lifecycle
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned', 'archived'],
    default: 'active'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  endedAt: Date,
  // AI model information
  aiModel: {
    provider: {
      type: String,
      enum: ['openai', 'anthropic', 'cohere', 'custom'],
      default: 'openai'
    },
    model: {
      type: String,
      default: 'gpt-3.5-turbo'
    },
    version: String,
    parameters: {
      temperature: Number,
      maxTokens: Number,
      topP: Number
    }
  },
  // Quality and moderation
  qualityMetrics: {
    relevanceScore: Number,
    helpfulnessScore: Number,
    accuracyScore: Number,
    flaggedContent: Boolean,
    moderationFlags: [String]
  },
  // Outcomes and actions taken
  outcomes: {
    destinationsRecommended: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination"
    }],
    itinerariesCreated: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary"
    }],
    bookingsMade: [String], // booking IDs or references
    followUpRequired: Boolean,
    issuesEscalated: Boolean
  }
}, { 
  timestamps: true,
  // Automatically remove old conversations
  // TTL index will be set below
});

// Indexes for efficient querying
chatConversationSchema.index({ userId: 1, createdAt: -1 }); // User's conversations
chatConversationSchema.index({ sessionId: 1 }); // Session lookup
chatConversationSchema.index({ status: 1, lastActivity: -1 }); // Active conversations
chatConversationSchema.index({ 'context.currentTopic': 1, createdAt: -1 }); // Topic-based queries
chatConversationSchema.index({ 'metadata.platform': 1, createdAt: -1 }); // Platform analytics
chatConversationSchema.index({ 'metadata.source': 1, createdAt: -1 }); // Source analytics
chatConversationSchema.index({ isArchived: 1, updatedAt: -1 }); // Archived conversations
chatConversationSchema.index({ 'aiModel.provider': 1, 'aiModel.model': 1 }); // Model performance tracking

// Compound indexes for complex queries
chatConversationSchema.index({
  userId: 1,
  status: 1,
  lastActivity: -1
}); // User's active conversations

chatConversationSchema.index({
  'context.currentTopic': 1,
  status: 1,
  'stats.userSatisfactionScore': -1
}); // Topic performance analysis

chatConversationSchema.index({
  'metadata.platform': 1,
  'metadata.source': 1,
  createdAt: -1
}); // Platform and source analytics

// Text search index for conversation content
chatConversationSchema.index({
  title: "text",
  "messages.content": "text"
});

// TTL index for automatic cleanup of old conversations (keep for 1 year)
chatConversationSchema.index(
  { createdAt: 1 }, 
  { expireAfterSeconds: 365 * 24 * 60 * 60 } // 1 year
);

// Virtual for conversation duration in real-time
chatConversationSchema.virtual('currentDuration').get(function() {
  if (this.endedAt) {
    return Math.round((this.endedAt - this.createdAt) / (1000 * 60)); // in minutes
  }
  return Math.round((Date.now() - this.createdAt) / (1000 * 60)); // in minutes
});

// Pre-save middleware to update stats
chatConversationSchema.pre('save', function(next) {
  // Update message count
  this.stats.messageCount = this.messages.length;
  
  // Update total tokens
  this.stats.totalTokens = this.messages.reduce((total, msg) => {
    return total + (msg.metadata?.tokens || 0);
  }, 0);
  
  // Update last activity
  this.lastActivity = Date.now();
  
  // Calculate average response time
  const assistantMessages = this.messages.filter(msg => msg.role === 'assistant');
  if (assistantMessages.length > 0) {
    const totalResponseTime = assistantMessages.reduce((total, msg) => {
      return total + (msg.metadata?.processingTime || 0);
    }, 0);
    this.stats.avgResponseTime = Math.round(totalResponseTime / assistantMessages.length);
  }
  
  next();
});

// Method to add a message to the conversation
chatConversationSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata,
    timestamp: new Date()
  });
  return this.save();
};

// Method to end conversation
chatConversationSchema.methods.endConversation = function(satisfactionScore = null) {
  this.status = 'completed';
  this.endedAt = new Date();
  this.stats.conversationDuration = Math.round((this.endedAt - this.createdAt) / (1000 * 60));
  
  if (satisfactionScore) {
    this.stats.userSatisfactionScore = satisfactionScore;
  }
  
  return this.save();
};

// Static method to get active conversations for a user
chatConversationSchema.statics.getActiveConversations = function(userId) {
  return this.find({
    userId,
    status: 'active',
    isArchived: false
  }).sort({ lastActivity: -1 });
};

// Static method to get conversation analytics
chatConversationSchema.statics.getAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        avgDuration: { $avg: '$stats.conversationDuration' },
        avgSatisfaction: { $avg: '$stats.userSatisfactionScore' },
        totalMessages: { $sum: '$stats.messageCount' },
        avgMessagesPerConversation: { $avg: '$stats.messageCount' },
        topTopics: { $push: '$context.currentTopic' }
      }
    }
  ]);
};

const ChatConversation = mongoose.model("ChatConversation", chatConversationSchema);

export default ChatConversation;