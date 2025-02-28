const mongoose = require("mongoose");
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");
const User = require("../models/UserModel");
const transporter = require("../utils/nodemailer");
const { createNotification } = require("./notificationController");

exports.createRide = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user_id, start, stops, destination, time, completionTime, date, seats, price } = req.body;

    // Validation for required fields
    if (!user_id || !start || !destination || !time || !completionTime || !date || seats === undefined || price === undefined) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "All required fields must be provided",
        required: ["user_id", "start", "destination", "time", "completionTime", "date", "seats", "price"],
      });
    }

    if (stops && !Array.isArray(stops)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Stops must be an array of locations",
      });
    }

    const seatsNum = Number(seats);
    const priceNum = Number(price);

    if (isNaN(seatsNum) || seatsNum < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Seats must be a positive number",
      });
    }

    if (isNaN(priceNum) || priceNum < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Price must be a non-negative number",
      });
    }

    // Validate time and completionTime as valid dates
    const startTime = new Date(time);
    const endTime = new Date(completionTime);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid time or completionTime format" });
    }

    if (endTime <= startTime) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "completionTime must be after start time" });
    }

    // Fetch the user (driver) to ensure they exist
    const driver = await User.findById(user_id).session(session);
    if (!driver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User (driver) not found" });
    }

    // Create the new ride
    const newRide = new Ride({
      start,
      stops: stops || [],
      destination,
      time: startTime,
      completionTime: endTime,
      date,
      seats: seatsNum,
      price: priceNum,
      driver: user_id,
      status: "upcoming", // Default status
    });
    const savedRide = await newRide.save({ session });

    // Increment ridesOffered for the driver
    driver.ridesOffered += 1;
    await driver.save({ session });

    // Create notification for the driver
    await createNotification(
      user_id,
      `Your ride from ${start} to ${destination} on ${date} at ${startTime.toLocaleTimeString()} has been successfully listed!`,
      "ride_request",
      true,
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Ride created successfully",
      ride: savedRide,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

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

    // Validation
    if (!start || !destination || !seats || !id) {
      console.log("Validation failed: Missing required fields");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "All required fields must be provided",
        required: ["start", "destination", "seats"],
      });
    }

    const seatsNum = Number(seats);
    if (isNaN(seatsNum) || seatsNum < 1) {
      console.log("Validation failed: Seats must be a positive number");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seats must be a positive number" });
    }

    // Fetch and validate ride
    console.log(`Fetching ride ${id}`);
    const existingRide = await Ride.findById(id).session(session);
    if (!existingRide) {
      console.log("Ride not found");
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Ride not found" });
    }

    if (existingRide.driver.toString() === passengerId) {
      console.log("Cannot book own ride");
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Cannot book your own ride" });
    }

    console.log(`Checking seats: requested ${seatsNum}, available ${existingRide.seats}`);
    if (seatsNum > existingRide.seats) {
      console.log("Not enough seats available");
      await session.abortTransaction();
      session.endSession();
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

    // Fetch driver and passenger
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

    // Increment ridesTaken for the passenger
    passenger.ridesTaken += 1;
    await passenger.save({ session });
    console.log(`Incremented ridesTaken for passenger ${passengerId}: ${passenger.ridesTaken}`);

    // Email to passenger
    const passengerMailOptions = {
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
          <li>Time: ${existingRide.time}</li>
          <li>Seats Booked: ${seatsNum}</li>
        </ul>
        <p><strong>Driver Contact Info:</strong></p>
        <ul>
          <li>Name: ${driver.firstName} ${driver.lastName}</li>
          <li>Phone: ${driver.phoneNumber}</li>
          <li>Email: ${driver.email}</li>
        </ul>
        <p>The driver will contact you to confirm the pickup details. Contact the driver for details about pickup time and charges.</p>
      `,
    };

    console.log(`Sending email to passenger ${passenger.email}`);
    await transporter.sendMail(passengerMailOptions);
    console.log(`Email sent successfully to ${passenger.email}`);

    // Email to driver
    const driverMailOptions = {
      from: process.env.EMAIL_USER,
      to: driver.email,
      subject: `New Booking for Your Ride to ${existingRide.destination}`,
      html: `
        <h2>New Passenger Booking</h2>
        <p>A passenger has booked a ride with you!</p>
        <p><strong>Ride Details:</strong></p>
        <ul>
          <li>Pickup: ${start}</li>
          <li>Destination: ${destination}</li>
          <li>Date: ${existingRide.date}</li>
          <li>Time: ${existingRide.time}</li>
          <li>Seats Booked: ${seatsNum}</li>
        </ul>
        <p><strong>Passenger Contact Info:</strong></p>
        <ul>
          <li>Name: ${passenger.firstName} ${passenger.lastName}</li>
          <li>Phone: ${passenger.phoneNumber}</li>
          <li>Email: ${passenger.email}</li>
        </ul>
        <p>Please contact the passenger to confirm pickup details and discuss payment arrangements.</p>
      `,
    };

    console.log(`Sending email to driver ${driver.email}`);
    await transporter.sendMail(driverMailOptions);
    console.log(`Email sent successfully to ${driver.email}`);

    // Notifications
    await createNotification(
      passengerId,
      `Your booking from ${start} to ${destination} with ${seatsNum} seat${seatsNum > 1 ? "s" : ""} has been confirmed! Check your email for driver details.`,
      "ride_accepted",
      false,
      { session } // Assuming createNotification supports session
    );

    await createNotification(
      existingRide.driver.toString(),
      `${passenger.firstName} ${passenger.lastName} booked ${seatsNum} seat${seatsNum > 1 ? "s" : ""} on your ride from ${existingRide.start} to ${existingRide.destination} on ${existingRide.date} at ${existingRide.time}. Check your email for passenger details.`,
      "ride_booked",
      false,
      { session } // Assuming createNotification supports session
    );

    // Commit the transaction
    await session.commitTransaction();
    console.log("Transaction committed");

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