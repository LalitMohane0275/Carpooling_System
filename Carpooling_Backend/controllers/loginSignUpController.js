const bcrypt = require('bcrypt');
const User = require('../models/UserModel'); // Adjust the path as per your directory structure

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

    // Respond to client
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
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

    // Respond with a success message
    res.status(200).json({ message: 'Login successful.', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { signup, login };