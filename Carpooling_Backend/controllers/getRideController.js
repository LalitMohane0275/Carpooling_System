// getRideController.js
const mongoose = require("mongoose");
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");

// Controller to get all rides
exports.getRides = async (req, res) => {
  try {
    // Fetch all rides and populate the driver field with firstName, lastName, and profilePicture
    const rides = await Ride.find().populate("driver", "firstName lastName profilePicture");

    // Check if rides exist
    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: "No rides available" });
    }

    //filter the rides if 0 seats then dont add them
    const availableRides = rides.filter((ride) => ride.seats > 0);

    // Send success response with populated rides data
    res.status(200).json({
      message: "Rides fetched successfully",
      rides: availableRides,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch rides",
      error: err.message,
    });
  }
};

// ... other controllers remain unchanged


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
        const rides = await Ride.find({driver});

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



exports.getPassengerRidesByPassengerId = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { passenger } = req.params;

    // Validate passenger ID
    if (!mongoose.Types.ObjectId.isValid(passenger)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid passenger ID" });
    }

    // Fetch passenger rides with populated ride and driver details
    const passengerRides = await PassengerRide.find({ passenger })
      .populate({
        path: "ride",
        populate: {
          path: "driver",
          select: "firstName lastName photo", // Adjust fields based on your User model
        },
      })
      .session(session);

    if (!passengerRides || passengerRides.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "No rides found for this passenger" });
    }

    const now = new Date();

    // Update each passenger ride's status based on the linked ride
    for (const passengerRide of passengerRides) {
      const ride = passengerRide.ride;

      if (!ride) {
        console.warn(`Ride not found for PassengerRide ${passengerRide._id}`);
        continue; // Skip if ride is not populated (shouldn't happen due to ref integrity)
      }

      let newStatus = ride.status;

      // Update ride status based on current time
      if (ride.status === "upcoming" && new Date(ride.time) <= now) {
        newStatus = "ongoing";
      } else if (ride.status === "ongoing" && new Date(ride.completionTime) <= now) {
        newStatus = "completed";
      }

      // If ride status has changed, update both Ride and PassengerRide
      if (newStatus !== ride.status) {
        ride.status = newStatus;
        await ride.save({ session });
      }

      // Sync PassengerRide status with Ride status
      if (passengerRide.status !== newStatus) {
        passengerRide.status = newStatus;
        await passengerRide.save({ session });
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Fetch updated rides for response (without session, as transaction is complete)
    const updatedRides = await PassengerRide.find({ passenger })
      .populate({
        path: "ride",
        populate: {
          path: "driver",
          select: "firstName lastName photo",
        },
      });

    res.status(200).json({
      message: "Passenger rides fetched successfully",
      rides: updatedRides,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error in getPassengerRidesByPassengerId:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid passenger ID" });
    }
    res.status(500).json({
      message: "Failed to fetch passenger ride details",
      error: err.message,
    });
  }
};