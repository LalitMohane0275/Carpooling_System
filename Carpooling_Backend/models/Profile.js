const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName:{ type: String, required: true },
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

module.exports = mongoose.model('Profile', ProfileSchema);
