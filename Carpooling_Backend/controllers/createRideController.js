// createRideController.js
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");
const User = require("../models/UserModel");
const transporter = require("../utils/nodemailer"); // Use your Nodemailer setup
const mongoose = require("mongoose");

exports.createRide = async (req, res) => {
  try {
    // Fetch data from request body
    const { user_id, start, stops, destination, time, date, seats, price } = req.body;
    
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has a vehicle
    if (!user.hasVehicle || !user.vehicleDetails || !user.vehicleDetails.make || !user.vehicleDetails.model) {
      return res.status(403).json({ 
        message: "You cannot create a ride because you have not provided vehicle details. Please update your profile first." 
      });
    }

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { start, destination, seats } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = require("jsonwebtoken").decode(token);
    const passengerId = decoded.userId;

    console.log(`Starting booking for ride ${id}, passenger ${passengerId}, seats: ${seats}`);

    // Validate input
    if (!start || !destination || !seats || !id) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({
        message: "All required fields must be provided",
        required: ["start", "destination", "seats"],
      });
    }

    // Convert seats to number and validate
    const seatsNum = Number(seats);
    if (isNaN(seatsNum) || seatsNum < 1) {
      console.log("Validation failed: Seats must be a positive number");
      return res.status(400).json({ message: "Seats must be a positive number" });
    }

    // Fetch the ride
    console.log(`Fetching ride ${id}`);
    const existingRide = await Ride.findById(id).session(session);
    if (!existingRide) {
      console.log("Ride not found");
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if passenger is the driver
    if (existingRide.driver.toString() === passengerId) {
      console.log("Cannot book own ride");
      return res.status(403).json({ message: "Cannot book your own ride" });
    }

    // Check seat availability
    console.log(`Checking seats: requested ${seatsNum}, available ${existingRide.seats}`);
    if (seatsNum > existingRide.seats) {
      console.log("Not enough seats available");
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Update ride seats
    existingRide.seats -= seatsNum;
    console.log(`Updating seats: new count ${existingRide.seats}`);
    await existingRide.save({ session });

    // Create passenger ride
    console.log("Creating passenger ride");
    const newPassengerRide = new PassengerRide({
      start,
      destination,
      time: existingRide.time,
      seats: seatsNum,
      ride: id,
      passenger: passengerId,
    });

    const savedPassengerRide = await newPassengerRide.save({ session });
    console.log("Passenger ride saved:", savedPassengerRide._id);

    // Fetch driver and passenger details
    console.log(`Fetching driver ${existingRide.driver} and passenger ${passengerId}`);
    const driver = await User.findById(existingRide.driver).session(session);
    const passenger = await User.findById(passengerId).session(session);

    if (!driver) {
      console.log("Driver not found");
      throw new Error("Driver not found");
    }
    if (!passenger) {
      console.log("Passenger not found");
      throw new Error("Passenger not found");
    }

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: passenger.email,
      subject: `Your Ride to ${destination} is Booked!`,
      html: `
        <h2>Ride Booking Confirmation</h2>
        <p>You’re off to <strong>${destination}</strong>!</p>
        <p><strong>Ride Details:</strong></p>
        <ul>
          <li>Pickup: ${start}</li>
          <li>Destination: ${destination}</li>
          <li>Date: ${existingRide.date}</li>
          <li>Seats Booked: ${seatsNum}</li>
        </ul>
        <p><strong>Driver Contact Info:</strong></p>
        <ul>
          <li>Name: ${driver.firstName} ${driver.lastName}</li>
          <li>Phone: ${driver.phoneNumber}</li>
          <li>Email: ${driver.email}</li>
        </ul>
        <p>The driver will contact you to confirm the pickup details. Contact the driver for details about pickup time and charges </p>
      `,
    };

    // Send email
    console.log(`Sending email to ${passenger.email}`);
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${passenger.email}`);

    // Commit the transaction
    await session.commitTransaction();
    console.log("Transaction committed");

    // Response with booking details
    res.status(201).json({
      message: "Passenger Ride created successfully",
      bookingDetails: {
        driverName: `${driver.firstName} ${driver.lastName}`,
        driverPhone: driver.phoneNumber,
        driverEmail: driver.email,
      },
      passengerRide: savedPassengerRide,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error in createPassengerRide:", err);

    if (err.message === "Not enough seats available") {
      return res.status(400).json({ message: err.message });
    }
    if (err.message === "Driver not found" || err.message === "Passenger not found") {
      return res.status(404).json({ message: err.message });
    }

    res.status(500).json({
      message: "An error occurred while creating the passenger ride",
      error: err.message,
    });
  } finally {
    session.endSession();
    console.log("Session ended");
  }
};