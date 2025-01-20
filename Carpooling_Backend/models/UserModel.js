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
        minlength: 6, 
    },
    firstName:{
        type: String,
        trim: true,
    },
    lastName:{
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 150,
    },
    gender:{
        type: String,
        enum: ['Male', 'Female'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;