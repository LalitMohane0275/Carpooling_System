const User = require('../models/UserModel'); 


// Check Profile Completion
exports.checkProfile = async (req, res) => {
    const { id } = req.user; // Extract user ID from the JWT token

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.firstName || !user.lastName || !user.age) {
            return res.status(200).json({ redirectTo: '/create-profile' });
        }

        const profileUrl = `/profile/${user.firstName}_${user.lastName}`;
        return res.status(200).json({ redirectTo: profileUrl });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create or Update Profile
exports.createProfile = async (req, res) => {
    const { id } = req.params; 
    const { firstName, lastName, age, gender } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        user.gender = gender;

        await user.save();

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};