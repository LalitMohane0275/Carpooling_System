// Import model 
const Ride = require("../models/RideModel");

// Business Logic
exports.createRide = async (req, res) => {
    try {
        // Fetch data from request body
        const { start, destination, time, date, seats } = req.body;

        // Validate required fields
        if (!start || !destination || !time || !date || !seats) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new ride object
        const newRide = new Ride({
            start,
            destination,
            time,
            date,
            seats,
        });

        // Save the ride to MongoDB
        const savedRide = await newRide.save();

        // Send success response
        res.status(201).json({
            message: "Ride created successfully",
            ride: savedRide,
        });
    } catch (err) {
        console.error(err);

        // Send error response
        res.status(500).json({
            message: "An error occurred while creating the ride",
            error: err.message,
        });
    }
};
