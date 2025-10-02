import Joi from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      username: {
        type: String,
        unique: true,
        sparse: true,
      },
      phoneNumber: {
        type: String,
      },
      dateOfBirth: {
        type: Date,
      },
      nationality: {
        type: String,
      },
      bio: {
        type: String,
        maxlength: 500,
      },
      location: {
        city: {
          type: String,
        },
        country: {
          type: String,
        },
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
      interests: {
        type: [String],
        default: [],
      },
      travelStyle: {
        type: String,
        enum: ['adventure', 'luxury', 'budget', 'cultural', 'nature', 'urban', 'relaxation'],
      },
      preferences: {
        type: [String],
      },
      language: {
        type: String,
        default: "en",
      },
      avatar: {
        type: String,
      },
    },
    statistics: {
      totalDestinationsVisited: {
        type: Number,
        default: 0,
      },
      totalItinerariesCreated: {
        type: Number,
        default: 0,
      },
      totalReviewsWritten: {
        type: Number,
        default: 0,
      },
      memberSince: {
        type: Date,
        default: Date.now,
      },
      lastLoginDate: {
        type: Date,
      },
      profileViews: {
        type: Number,
        default: 0,
      },
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
      },
    ],
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    socialProfile: {
      isPublic: {
        type: Boolean,
        default: true,
      },
      followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      privacy: {
        type: String,
        enum: ["public", "private", "friends"],
        default: "public",
      },
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      dataSharing: {
        type: Boolean,
        default: false,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
      currency: {
        type: String,
        default: "USD",
      },
      timeZone: {
        type: String,
        default: "UTC",
      },
    },
    lastActive: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.index({});

const User = mongoose.model("User", userSchema);

export default User;
