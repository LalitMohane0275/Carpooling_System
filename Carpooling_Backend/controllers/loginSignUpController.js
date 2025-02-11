const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const cloudinary = require("../config/cloudinary");

// Upload profile data
const signup = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      address,
      hasVehicle,
      vehicleDetails,
      preferences,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !preferences
    ) {
      return res.status(400).json({ message: "Required data missing" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const saltRounds = 10; // Adjust the salt rounds as necessary
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Upload image to Cloudinary
    let profilePicture = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      profilePicture = {
        url : uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    // Save user to the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      address,
      hasVehicle: JSON.parse(hasVehicle),
      vehicleDetails: JSON.parse(vehicleDetails),
      preferences: JSON.parse(preferences),
      profilePictureUrl: profilePicture?.url,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: newUser,
      publicId: profilePicture?.publicId,
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );
    console.log(accessToken);

    // Respond with a success message
    res.status(200).json({
      message: "Login successful.",
      userId: user._id,
      token : accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { signup, login };
