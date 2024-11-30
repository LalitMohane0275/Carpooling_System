// Import the Ride model
const Ride = require("../models/RideModel");

// Controller to get all rides
exports.getRides = async (req, res) => {
    try {
        // Fetch all rides from the database
        const rides = await Ride.find();

        // Check if rides exist
        if (!rides || rides.length === 0) {
            return res.status(404).json({ message: "No rides available" });
        }

        // Send success response with rides data
        res.status(200).json({
            message: "Rides fetched successfully",
            rides: rides,
        });
    } catch (err) {
        console.error(err);

        // Send error response
        res.status(500).json({
            message: "Failed to fetch rides",
            error: err.message,
        });
    }
};
