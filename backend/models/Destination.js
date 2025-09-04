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
      enum: ["attraction", "hotel", "restaurant", , "activity"],
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
      wenesday: {
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
      currency: { type: Number, default: "LKR" },
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

destinationSchema.index({ location: "2dsphere" });
destinationSchema.index({
  name: "text",
  "description.en": "text",
  "description.si": "text",
  tags: "text",
});

destinationSchema.index({
  category: 1,
  "ratings.average": -1,
});

destinationSchema.index({
  featured: -1,
  createdAt: -1,
});

const Destination = mongoose.model("Destination", destinationSchema);
