const mongoose = require("mongoose");
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");
const User = require("../models/UserModel");
const transporter = require("../utils/nodemailer");
const { createNotification } = require("./notificationController");

exports.deleteRide = async (req, res) => {
  const session = await mongoose.startSession(); // Start a MongoDB session
  session.startTransaction(); // Begin the transaction

  try {
    const { rideId } = req.params;
    const userId = req.userInfo.userId;
    const { reason } = req.body;

    console.log(`Attempting to delete ride ${rideId} by user ${userId} with reason: ${reason}`);

    // Validate ride ID
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid ride ID" });
    }

    // Validate reason
    if (!reason) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Cancellation reason is required" });
    }

    // Fetch ride within the transaction
    const ride = await Ride.findById(rideId).populate("driver").session(session);
    if (!ride) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Ride not found" });
    }

    // Ensure driver matches userId
    if (!ride.driver || ride.driver._id.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "You can only delete your own rides" });
    }

    // Fetch driver and ensure they exist
    const driver = await User.findById(userId).session(session);
    if (!driver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Driver not found" });
    }

    // Check for booked passengers
    const passengerRides = await PassengerRide.find({ ride: rideId })
      .populate("passenger")
      .session(session);
    if (passengerRides.length > 0) {
      for (const passengerRide of passengerRides) {
        const passenger = passengerRide.passenger;

        const driverEmail = ride.driver.email || "N/A";
        const driverPhone = ride.driver.phoneNumber || "N/A";

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: passenger.email,
          subject: "Ride Cancellation Notice",
          html: `
            <h2>Ride Cancelled</h2>
            <p>We’re sorry for the inconvenience, but your ride from <strong>${ride.start}</strong> to <strong>${ride.destination}</strong> on <strong>${ride.date} at ${ride.time}</strong> has been cancelled by the driver.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please contact the driver at <strong>${driverPhone}</strong> or <strong>${driverEmail}</strong> for further details or to arrange an alternative.</p>
            <p>We apologize for any disruption this may cause.</p>
          `,
        };
        await transporter.sendMail(mailOptions); // Email sending is outside transaction

        await createNotification(
          passenger._id,
          `We’re sorry for the inconvenience, but your ride from ${ride.start} to ${ride.destination} on ${ride.date} at ${ride.time} has been cancelled by the driver.`,
          "ride_cancelled",
          false,
          { session } // Assuming createNotification supports session; adjust if needed
        );
      }
    }

    // Delete the ride
    await Ride.findByIdAndDelete(rideId, { session });

    // Decrement ridesOffered for the driver
    if (driver.ridesOffered > 0) {
      driver.ridesOffered -= 1;
      await driver.save({ session });
    }

    // Notify driver of successful cancellation
    await createNotification(
      userId,
      `Your ride from ${ride.start} to ${ride.destination} on ${ride.date} at ${ride.time} has been cancelled successfully. Reason: ${reason}`,
      "ride_cancelled",
      false,
      { session } // Assuming createNotification supports session; adjust if needed
    );

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Ride deleted successfully",
      hasPassengers: passengerRides.length > 0,
    });
  } catch (error) {
    // Roll back the transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting ride:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to delete ride",
      error: error.message,
    });
  }
};