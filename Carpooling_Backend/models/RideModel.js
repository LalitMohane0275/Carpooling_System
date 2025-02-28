const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    trim: true,
  },
  stops: [{
    type: String,
    trim: true,
  }],
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: Date, // Changed to Date for easier comparison
    required: true,
  },
  completionTime: {
    type: Date, // New field for completion time
    required: true,
  },
  date: {
    type: String, // Keeping as string for consistency, but could be Date if preferred
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
}, { timestamps: true });

// Index for efficient querying of rides based on time and completionTime
RideSchema.index({ time: 1, completionTime: 1, status: 1 });

module.exports = mongoose.model("Ride", RideSchema);