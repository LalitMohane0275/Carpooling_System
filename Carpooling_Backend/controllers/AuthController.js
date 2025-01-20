const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // Adjust the path as per your directory structure
const jwtConfig = require('../config/jwtConfig'); // Create this file to store JWT secret and expiry settings
require('dotenv').config(); 

// Signup Function
const signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Validate input fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
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

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond to client
    res.status(201).json({ message: 'User registered successfully.' , token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Login Function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const payload = {
      email: user.email,
      id: user._id,
    }

    // Compare password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT
    let token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    user = user.toObject();
    user.token = token;
    user.password = undefined;

    // Respond with a success message and token
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token, 
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


module.exports = { signup, login };
