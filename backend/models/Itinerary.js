import Joi from "joi";
import mongoose from "mongoose";

const destinationPlanSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    arrivalTime: {
      type: String,
    },
    departureTime: {
      type: String,
    },
    notes: {
      type: String,
    },
    transportMode: {
      type: String,
    },
  },
  { _id: false }
);

const accommodationPlanSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    date: { type: Date },
    destinations: [destinationPlanSchema],
    accommodations: [accommodationPlanSchema],
    totalBudget: { type: Number },
    notes: { type: String },
  },
  { _id: false }
);

const itinerarySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    duration: {
      type: Number,
    },
    days: [daySchema],
    metadata: {
      totalBudget: {
        type: Number,
      },
      currency: {
        type: String,
        default: "LKR",
      },
      travelStyle: {
        type: String,
        enum: ["budget", "mid-range", "luxury"],
      },
      groupSize: {
        type: Number,
      },
    },
    sharing: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
      allowFork: {
        type: Boolean,
        default: false,
      },
    },
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      forks: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
itinerarySchema.index({ userId: 1, createdAt: -1 }); // User's itineraries
itinerarySchema.index({ 'sharing.isPublic': 1, createdAt: -1 }); // Public itineraries
itinerarySchema.index({ 'sharing.isPublic': 1, 'stats.views': -1 }); // Popular public itineraries
itinerarySchema.index({ 'sharing.isPublic': 1, 'stats.likes': -1 }); // Most liked itineraries
itinerarySchema.index({ duration: 1, 'sharing.isPublic': 1 }); // Duration-based filtering
itinerarySchema.index({ 'metadata.travelStyle': 1, 'sharing.isPublic': 1 }); // Travel style filtering
itinerarySchema.index({ 'metadata.totalBudget': 1, 'sharing.isPublic': 1 }); // Budget-based filtering

// Text search index
itinerarySchema.index({
  title: "text",
  description: "text"
});

// Compound indexes for complex queries
itinerarySchema.index({
  'sharing.isPublic': 1,
  'metadata.travelStyle': 1,
  duration: 1
}); // Public itineraries by style and duration

itinerarySchema.index({
  userId: 1,
  'sharing.isPublic': 1,
  updatedAt: -1
}); // User's itineraries with visibility

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
