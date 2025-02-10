const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    hasVehicle: { type: Boolean, default: false },
    vehicleDetails: {
        make: { type: String, default: '' },
        model: { type: String, default: '' },
        year: { type: String, default: '' },
        licensePlate: { type: String, default: '' },
    },
    preferences: {
        smokingAllowed: { type: Boolean, default: false },
        petsAllowed: { type: Boolean, default: false },
        musicAllowed: { type: Boolean, default: true },
    },
    profilePicture: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;