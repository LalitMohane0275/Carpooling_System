const mongoose = require("mongoose");
const User = require("../models/UserModel");

exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.params; 
    // console.log("Request Parameters:", req.params);

    // Check if `user_id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find the profile by `_id`
    const user = await User.findOne({ _id: user_id });
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
