import mongoose from "mongoose";

// Booking schema for travel bookings
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination"
  },
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary"
  },
  bookingType: {
    type: String,
    enum: ['accommodation', 'activity', 'transportation', 'package'],
    required: true
  },
  // Booking details
  details: {
    checkInDate: Date,
    checkOutDate: Date,
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 }
    },
    roomType: String,
    specialRequests: String
  },
  // Pricing information
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discounts: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'LKR' }
  },
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['card', 'bank_transfer', 'digital_wallet', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  },
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  confirmationCode: {
    type: String,
    unique: true,
    sparse: true
  },
  // Cancellation details
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: String,
    refundAmount: Number
  },
  // Additional metadata
  metadata: {
    source: {
      type: String,
      enum: ['website', 'mobile_app', 'api', 'agent'],
      default: 'website'
    },
    userAgent: String,
    ipAddress: String,
    affiliate: String
  }
}, { timestamps: true });

// Indexes for booking queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ destinationId: 1, 'details.checkInDate': 1 });
bookingSchema.index({ status: 1, 'details.checkInDate': 1 });
// bookingSchema.index({ confirmationCode: 1 }); // Removed - already unique
bookingSchema.index({ 'payment.status': 1, createdAt: -1 });
bookingSchema.index({ bookingType: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

// Activity/Tour schema
const activitySchema = new mongoose.Schema({
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    en: String,
    si: String,
    ta: String
  },
  category: {
    type: String,
    enum: ['adventure', 'cultural', 'wildlife', 'water_sports', 'hiking', 'sightseeing', 'food_tour'],
    required: true
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme']
  },
  // Pricing
  pricing: {
    adult: { type: Number, required: true },
    child: { type: Number },
    senior: { type: Number },
    group: { type: Number }, // group discount
    currency: { type: String, default: 'LKR' }
  },
  // Availability
  availability: {
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0 = Sunday
    timeSlots: [{
      startTime: String, // "09:00"
      endTime: String,   // "17:00"
      maxCapacity: Number
    }],
    seasonalAvailability: [{
      startDate: Date,
      endDate: Date,
      available: Boolean
    }]
  },
  // Requirements and includes
  includes: [String],
  excludes: [String],
  requirements: [String],
  whatToBring: [String],
  ageRestrictions: {
    minAge: Number,
    maxAge: Number
  },
  // Media
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  // Provider information
  provider: {
    name: String,
    contact: String,
    license: String,
    rating: { type: Number, min: 0, max: 5 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Activity indexes
activitySchema.index({ destinationId: 1, category: 1 });
activitySchema.index({ category: 1, 'pricing.adult': 1 });
activitySchema.index({ difficulty: 1, isActive: 1 });
activitySchema.index({ 'availability.daysOfWeek': 1 });

const Activity = mongoose.model("Activity", activitySchema);

export { Booking, Activity };