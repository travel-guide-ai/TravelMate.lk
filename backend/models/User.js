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
      },
      pushNotifications: {
        type: Boolean,
      },
      privacy: {
        type: String,
        enum: ["public", "private", "friends"],
        default: "public",
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
