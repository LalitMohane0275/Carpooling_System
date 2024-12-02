// Import Mongoose
const mongoose = require('mongoose');

// Route Handler
const PassengerRideSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId, // ObjectId for referencing another document
      ref: "Ride", // Name of the model being referenced
      required: true,
    },
  },
  { timestamps: true } // Add timestamps to track creation and update time
);

// Export
module.exports = mongoose.model("PassengerRide", PassengerRideSchema);
