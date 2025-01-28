// Import model 
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");
const User = require("../models/UserModel");

// Business Logic
exports.createRide = async (req, res) => {
    try {
        // Fetch data from request body
        const { email, start, destination, time, date, seats } = req.body;

        // Validate required fields
        if (! email || !start || !destination || !time || !date || !seats) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // fetch user details from userprofile
        const user = await User.findOne({ email });
        
        // Check if user is authenticated
        
        // Check if user has vehicle and vehicle details
        


        // Create a new ride object
        const newRide = new Ride({
            start,
            destination,
            time,
            date,
            seats,
            driver: user._id,
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


exports.createPassengerRide = async (req, res) => {
    try {
        const { id } = req.params; // Ride ID from the route
        const { start, destination, time, seats } = req.body;

        // Validate required fields
        if (!start || !destination || !time || !seats || !id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the ride ID exists
        const existingRide = await Ride.findById(id);
        if (!existingRide) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Create a new PassengerRide object
        const newPassengerRide = new PassengerRide({
            start,
            destination,
            time,
            seats,
            ride: id, // Assign the ride ID to the `ride` field
        });

        // Save the PassengerRide to MongoDB
        const savedPassengerRide = await newPassengerRide.save();

        // Send success response
        res.status(201).json({
            message: "Passenger Ride created successfully",
            PassengerRide: savedPassengerRide,
        });
    } catch (err) {
        console.error(err);

        // Send error response
        res.status(500).json({
            message: "An error occurred while creating the passenger ride",
            error: err.message,
        });
    }
};
