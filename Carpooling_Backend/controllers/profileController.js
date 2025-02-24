const mongoose = require("mongoose");
const User = require("../models/UserModel");
const multer = require("multer");

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params; 
    // console.log("Request Parameters:", req.params);

    // Check if `userId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find the profile by `_id`
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Return the profile data
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const updates = req.body;

    // Check if the request body is empty
    if (Object.keys(updates).length === 0 && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // If a profile picture is uploaded, update the profilePicture field
    if (req.file) {
      updates.profilePicture = req.file.path; // Ensure this matches your static file serving setup
    }

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};


// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const updates = req.body; // Get all fields dynamically from request body
//     if (req.file) {
//       updates.profilePicture = `/uploads/${req.file.filename}`;
//     }
//     // Find user and update details
//     const updatedUser = await User.findByIdAndUpdate(userId, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile", error: error.message });
//   }
// };
