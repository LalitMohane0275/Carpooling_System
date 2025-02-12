// Import the Ride model
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");

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


// Controller to get details of a specific ride by ID
exports.getRide = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch ride by ID from the database
        const ride = await Ride.findById(id);

        // Check if ride exists
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Send success response with ride data
        res.status(200).json({
            message: "Ride fetched successfully",
            ride: ride,
        });
    } catch (err) {
        console.error(err);

        // Handle invalid IDs and other errors
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ride ID" });
        }

        // Send error response
        res.status(500).json({
            message: "Failed to fetch ride details",
            error: err.message,
        });
    }
};


// Controller to get details of a specific ride by ID
exports.getRidesByDriverId = async (req, res) => {
    try {
        const { driver } = req.params;

        // Fetch ride by ID from the database
        const rides = await Ride.findOne({driver});

        // Check if ride exists
        if (!rides) {
            return res.status(404).json({ message: "Rides of user not found" });
        }

        // Send success response with ride data
        res.status(200).json({
            message: "Rides fetched successfully",
            rides: rides,
        });
    } catch (err) {
        console.error(err);

        // Handle invalid IDs and other errors
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ride ID" });
        }

        // Send error response
        res.status(500).json({
            message: "Failed to fetch ride details of user",
            error: err.message,
        });
    }
};


// Controller to get details of a specific ride by ID
exports.getPassengerRidesByDriverId = async (req, res) => {
    try {
        const { driver } = req.params;

        // Fetch ride by ID from the database
        const rides = await PassengerRide.findOne({driver});

        // Check if ride exists
        if (!rides) {
            return res.status(404).json({ message: "Rides of user not found" });
        }

        // Send success response with ride data
        res.status(200).json({
            message: "Rides fetched successfully",
            rides: rides,
        });
    } catch (err) {
        console.error(err);

        // Handle invalid IDs and other errors
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ride ID" });
        }

        // Send error response
        res.status(500).json({
            message: "Failed to fetch ride details of driver",
            error: err.message,
        });
    }
};