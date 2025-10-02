import mongoose from "mongoose";
const destinationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ["attraction", "hotel", "restaurant", "activity"],
      required: true,
    },
    subCategory: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
      },
    },
    description: {
      en: {
        type: String,
      },
      si: {
        type: String,
      },
      ta: {
        type: String,
      },
    },
    images: [
      {
        url: {
          type: String,
        },
        alt: {
          type: String,
        },
        caption: {
          type: String,
        },
      },
    ],
    amenities: {
      type: [String],
    },
    openingHours: {
      monday: {
        open: String,
        close: String,
      },
      tuesday: {
        open: String,
        close: String,
      },
      wednesday: {
        open: String,
        close: String,
      },
      thursday: {
        open: String,
        close: String,
      },
      friday: {
        open: String,
        close: String,
      },
      saturday: {
        open: String,
        close: String,
      },
      sunday: {
        open: String,
        close: String,
      },
    },
    pricing: {
      currency: { type: String, default: "LKR" },
      adult: {
        type: Number,
      },
      child: {
        type: Number,
      },
      foreigner: {
        type: Number,
      },
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    tags: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

destinationSchema.index({ location: "2dsphere" }); // Geospatial queries
destinationSchema.index({
  name: "text",
  "description.en": "text",
  "description.si": "text",
  "description.ta": "text",
  tags: "text",
}); // Text search

// Core filtering indexes
destinationSchema.index({ category: 1, "ratings.average": -1 }); // Category with rating sort
destinationSchema.index({ featured: -1, createdAt: -1 }); // Featured destinations
destinationSchema.index({ isActive: 1, category: 1 }); // Active destinations by category
destinationSchema.index({ "location.city": 1, category: 1 }); // City-based filtering
destinationSchema.index({ "location.province": 1, category: 1 }); // Province-based filtering

// Advanced filtering indexes
destinationSchema.index({ tags: 1, "ratings.average": -1 }); // Tag-based with rating
destinationSchema.index({ "pricing.adult": 1, category: 1 }); // Price-based filtering
destinationSchema.index({ amenities: 1, category: 1 }); // Amenity-based filtering
destinationSchema.index({ createdBy: 1, createdAt: -1 }); // User's destinations

// Performance optimization indexes
// destinationSchema.index({ slug: 1 }); // Removed - already unique
destinationSchema.index({ "ratings.count": -1 }); // Popular destinations (by review count)
destinationSchema.index({ featured: 1, "ratings.average": -1, "ratings.count": -1 }); // Homepage featured

// Compound indexes for complex queries
destinationSchema.index({
  "location.city": 1,
  category: 1,
  "ratings.average": -1
}); // Location + category + rating
destinationSchema.index({
  isActive: 1,
  featured: 1,
  "ratings.average": -1
}); // Active featured with rating

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
