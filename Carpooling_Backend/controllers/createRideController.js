// createRideController.js
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");
const User = require("../models/UserModel");

// createRideController.js
exports.createRide = async (req, res) => {
  try {
    // Fetch data from request body
    const { user_id, start, stops, destination, time, date, seats, price } = req.body;

    // Validate required fields
    if (!user_id || !start || !destination || !time || !date || seats === undefined || price === undefined) {
      return res.status(400).json({ 
        message: "All required fields must be provided",
        required: ["user_id", "start", "destination", "time", "date", "seats", "price"]
      });
    }

    // Validate and convert stops
    if (stops && !Array.isArray(stops)) {
      return res.status(400).json({
        message: "Stops must be an array of locations"
      });
    }

    // Convert seats and price to numbers and validate
    const seatsNum = Number(seats);
    const priceNum = Number(price);

    if (isNaN(seatsNum) || seatsNum < 1) {
      return res.status(400).json({
        message: "Seats must be a positive number"
      });
    }

    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        message: "Price must be a non-negative number"
      });
    }

    // Create a new ride object
    const newRide = new Ride({
      start,
      stops: stops || [],
      destination,
      time,
      date,
      seats: seatsNum,
      price: priceNum,
      driver: user_id,
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
    res.status(500).json({
      message: "An error occurred while creating the ride",
      error: err.message,
    });
  }
};

exports.createPassengerRide = async (req, res) => {
    try {
        const { id } = req.params;
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
            ride: id,
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
        res.status(500).json({
            message: "An error occurred while creating the passenger ride",
            error: err.message,
        });
    }
};