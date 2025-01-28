// Import Mongoose 
const mongoose = require('mongoose');

// Route Handler 
const RideSchema = new mongoose.Schema({
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
    date: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
        min: 1,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    }
}, { timestamps: true }); // Add timestamps to track creation and update time

// Export 
module.exports = mongoose.model("Ride", RideSchema);
