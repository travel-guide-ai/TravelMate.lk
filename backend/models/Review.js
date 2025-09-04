import { ref, required } from "joi";
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

const Review = mongoose.model("Review", reviewSchema);

export default Review;
