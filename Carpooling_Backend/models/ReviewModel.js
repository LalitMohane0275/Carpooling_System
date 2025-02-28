const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the passenger (User model)
    required: true
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride', // Reference to Ride model
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique index to prevent duplicate reviews by the same passenger for the same ride
reviewSchema.index({ passenger: 1, rideId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);