const bcrypt = require('bcrypt');
const User = require('../models/UserModel'); 
const Profile = require('../models/Profile');
const cloudinary = require("cloudinary").v2;

// });

cloudinary.config({
  cloud_name: "dxuxjltav",
  api_key: 288955458792195,
  api_secret: "36rFQxqeibmumXWfGOCCFCle7T4",
});

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
      confirmPassword 
    } = req.body;

    if(!email || !password  || ! confirmPassword || !firstName || !lastName ||!phoneNumber || !address || !preferences){
      return res.status(400).json({ message: "Required data missing" });
    }

     // Check if passwords match
     if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const saltRounds = 10; // Adjust the salt rounds as necessary
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user to database
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate a unique username
    let userName = `${firstName}_${lastName}_${Math.floor(1000 + Math.random() * 9000)}`; 

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
      email,
      firstName,
      middleName,
      lastName,
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
      message: "Signup successful",
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




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const profile = await Profile.findOne({email: user.email});
    if(!profile){
      return res.status(404).json({ message: 'Profile not found.' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Login successful.', userId: user._id , username: profile.userName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { signup, login };