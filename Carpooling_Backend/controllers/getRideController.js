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

exports.searchRides = async (req, res) => {
    const { source, destination, date } = req.body;

    try {
        // Validate input
        if (!source || !destination || !date) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Query the database for matching rides
        const rides = await Ride.find({
            start: { $regex: `^${source}`, $options: "i" }, // Matches the start with case-insensitive partial match
            destination: { $regex: `^${destination}`, $options: "i" }, // Matches the destination with case-insensitive partial match
            date: date, // Matches the date exactly
          });
          
          

        // Check if any rides are found
        if (rides.length === 0) {
            return res.status(404).json({ message: 'No rides found for the given criteria.' });
        }

        // Return the rides
        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};