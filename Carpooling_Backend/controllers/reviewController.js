const Review = require("../models/ReviewModel");
const Ride = require("../models/RideModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose"); // Import mongoose for session/transaction

// Submit a review
exports.submitReview = async (req, res) => {
  const session = await mongoose.startSession(); // Start a MongoDB session
  session.startTransaction(); // Begin the transaction

  try {
    const { passenger, rideId, description, rating } = req.body;
    console.log(`Review submission attempt: passenger=${passenger}, rideId=${rideId}`);

    // Validate rating
    if (rating < 1 || rating > 5) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if a review already exists
    const existingReview = await Review.findOne({ passenger, rideId }).session(session);
    if (existingReview) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You have already reviewed this ride" });
    }

    // Fetch ride with driver populated
    const ride = await Ride.findById(rideId).session(session);
    if (!ride) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Ride not found" });
    }

    // Fetch driver
    const driver = await User.findById(ride.driver).session(session); // Assuming ride.driver is the driver's ObjectId
    if (!driver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Driver not found" });
    }

    // Create new review within the transaction
    const review = new Review({
      passenger,
      rideId,
      description,
      rating,
    });
    await review.save({ session });

    // Update ride with review reference and recalculate average rating
    ride.reviews.push(review._id);
    const rideReviews = await Review.find({ rideId }).session(session);
    ride.averageRating = rideReviews.reduce((acc, r) => acc + r.rating, 0) / rideReviews.length || 0;
    await ride.save({ session });

    // Update driver's reviews and average rating
    driver.reviews.push(review._id);
    const driverReviews = await Review.find({ _id: { $in: driver.reviews } }).session(session);
    driver.averageRating = driverReviews.reduce((acc, r) => acc + r.rating, 0) / driverReviews.length || 0;
    await driver.save({ session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    // Roll back the transaction on error
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: "You have already reviewed this ride" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reviews for a ride (unchanged)
exports.getReviews = async (req, res) => {
  try {
    const { rideId } = req.params;
    const reviews = await Review.find({ rideId }).populate("passenger", "firstName lastName");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};