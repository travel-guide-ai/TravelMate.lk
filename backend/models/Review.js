import Joi from "joi";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    visitDate: {
      type: Date,
    },
    travelType: {
      type: String,
      enum: ["solo", "couple", "family", "friends"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    helpful: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reported: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    moderationStatus: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
reviewSchema.index({ destinationId: 1, createdAt: -1 }); // Destination reviews (latest first)
reviewSchema.index({ userId: 1, createdAt: -1 }); // User's reviews
reviewSchema.index({ destinationId: 1, rating: -1 }); // Destination reviews by rating
reviewSchema.index({ destinationId: 1, moderationStatus: 1, createdAt: -1 }); // Approved destination reviews
reviewSchema.index({ moderationStatus: 1, createdAt: 1 }); // Moderation queue
reviewSchema.index({ isVerified: 1, rating: -1 }); // Verified reviews by rating
reviewSchema.index({ visitDate: -1, moderationStatus: 1 }); // Recent visits
reviewSchema.index({ likes: -1, moderationStatus: 1 }); // Most helpful reviews
reviewSchema.index({ travelType: 1, destinationId: 1 }); // Reviews by travel type

// Text search index
reviewSchema.index({
  title: "text",
  content: "text"
});

// Compound indexes for complex queries
reviewSchema.index({
  destinationId: 1,
  moderationStatus: 1,
  rating: -1,
  createdAt: -1
}); // Approved destination reviews by rating and date

reviewSchema.index({
  userId: 1,
  moderationStatus: 1,
  createdAt: -1
}); // User's approved reviews

reviewSchema.index({
  destinationId: 1,
  travelType: 1,
  rating: -1
}); // Destination reviews by travel type and rating

const Review = mongoose.model("Review", reviewSchema);

export default Review;
