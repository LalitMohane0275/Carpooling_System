const Profile = require("../models/Profile"); // Import Profile model
const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "dxuxjltav",
  api_key: 288955458792195,
  api_secret: "36rFQxqeibmumXWfGOCCFCle7T4",
});

// Upload profile data
exports.uploadProfile = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      address,
      hasVehicle,
      vehicleDetails,
      preferences,
    } = req.body;

    // Split name into first and last name
    const [firstName, lastName] = name.split(" ");

    // Generate a unique username
    let userName = `${firstName}_${lastName}_${Math.floor(1000 + Math.random() * 9000)}`; // Random 4-digit number

    // Ensure username is unique in the database
    let isUnique = false;
    while (!isUnique) {
      const existingUser = await Profile.findOne({ where: { userName } });
      if (existingUser) {
        userName = `${firstName}_${lastName}_${Math.floor(1000 + Math.random() * 9000)}`;
      } else {
        isUnique = true;
      }
    }

    // Upload image to Cloudinary
    let profilePictureUrl = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      profilePictureUrl = uploadResult.secure_url;
    }

    // Save profile to the database
    const profile = await Profile.create({
      name,
      phoneNumber,
      address,
      hasVehicle: JSON.parse(hasVehicle),
      vehicleDetails: JSON.parse(vehicleDetails),
      preferences: JSON.parse(preferences),
      profilePicture: profilePictureUrl,
      userName, 
    });

    res.status(201).json({
      success: true,
      message: "Profile uploaded successfully",
      data: profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile",
      error: error.message,
    });
  }
};

// Get profile data (optional)
exports.getProfile = async (req, res) => {
  try {
    const { userName } = req.params; // Get userName from the URL

    // Find the profile by userName
    const profile = await Profile.findOne({ userName });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Return the profile data
    res.status(200).json({
      success: true,
      data: profile,
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