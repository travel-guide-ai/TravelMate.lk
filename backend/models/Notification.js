import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // System notifications may not have a sender
    },
    type: {
      type: String,
      required: true,
      enum: [
        "follow",
        "unfollow",
        "like",
        "comment",
        "review",
        "itinerary_shared",
        "destination_recommendation",
        "friend_activity",
        "system_update",
        "welcome",
        "achievement",
        "reminder",
        "booking_confirmation",
        "travel_alert",
      ],
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    data: {
      // Additional data specific to notification type
      entityType: {
        type: String,
        enum: ["user", "destination", "itinerary", "review", "comment", "system"],
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "data.entityType",
      },
      actionUrl: {
        type: String, // Deep link or URL for the notification action
      },
      metadata: {
        type: mongoose.Schema.Types.Mixed, // Flexible metadata for each notification type
      },
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
      index: true,
    },
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
    delivery: {
      inApp: {
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: {
          type: Date,
        },
        readAt: {
          type: Date,
        },
      },
      email: {
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: {
          type: Date,
        },
        openedAt: {
          type: Date,
        },
        clickedAt: {
          type: Date,
        },
      },
      push: {
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: {
          type: Date,
        },
        clickedAt: {
          type: Date,
        },
      },
      sms: {
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: {
          type: Date,
        },
      },
    },
    scheduledFor: {
      type: Date,
      index: true,
    },
    expiresAt: {
      type: Date,
      // index: true, // Removed duplicate index - using explicit TTL index below
    },
    groupKey: {
      type: String, // For grouping similar notifications
      index: true,
    },
    isGrouped: {
      type: Boolean,
      default: false,
    },
    groupCount: {
      type: Number,
      default: 1,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ groupKey: 1, recipient: 1 });

// Virtual for checking if notification is recent (last 24 hours)
notificationSchema.virtual('isRecent').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(notificationData) {
  const notification = new this(notificationData);
  
  // Set delivery channels based on user preferences
  if (notificationData.recipient) {
    const User = mongoose.model('User');
    const user = await User.findById(notificationData.recipient);
    
    if (user && user.settings) {
      notification.channels.email = user.settings.emailNotifications && notificationData.channels?.email;
      notification.channels.push = user.settings.pushNotifications && notificationData.channels?.push;
      notification.channels.sms = user.settings.smsNotifications && notificationData.channels?.sms;
    }
  }
  
  return await notification.save();
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.status = 'read';
  this.delivery.inApp.readAt = new Date();
  return await this.save();
};

// Instance method to mark as delivered for a specific channel
notificationSchema.methods.markAsDelivered = async function(channel) {
  if (this.delivery[channel]) {
    this.delivery[channel].delivered = true;
    this.delivery[channel].deliveredAt = new Date();
    return await this.save();
  }
};

// Pre-save hook to handle grouping
notificationSchema.pre('save', async function(next) {
  if (this.isNew && this.groupKey) {
    // Check if there are similar notifications to group
    const existingGroup = await this.constructor.findOne({
      recipient: this.recipient,
      groupKey: this.groupKey,
      status: 'unread',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (existingGroup) {
      // Update existing group notification
      existingGroup.groupCount += 1;
      existingGroup.isGrouped = true;
      existingGroup.message = this.generateGroupMessage(existingGroup.groupCount, existingGroup.type);
      existingGroup.updatedAt = new Date();
      await existingGroup.save();
      
      // Don't save this individual notification
      return next(new Error('GROUPED'));
    }
  }
  next();
});

// Helper method to generate group messages
notificationSchema.methods.generateGroupMessage = function(count, type) {
  const messageTemplates = {
    follow: `${count} people followed you`,
    like: `${count} people liked your content`,
    comment: `${count} new comments on your posts`,
    review: `${count} new reviews on destinations you bookmarked`,
  };
  
  return messageTemplates[type] || `${count} new ${type} notifications`;
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;