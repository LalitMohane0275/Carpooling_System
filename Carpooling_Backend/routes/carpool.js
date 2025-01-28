const express = require('express');
const router = express.Router();
const upload = require("../utils/multer"); // For handling file uploads

// Import Controller 
const {createRide, createPassengerRide} = require("../controllers/createRideController");
const {getRide, getRides} = require("../controllers/getRideController");
const { signup, login } = require('../controllers/loginSignUpController'); 

// Mapping Create
router.post("/create-ride",createRide);
router.post("/create-passengerRide/:id", createPassengerRide);
router.get("/find-ride", getRides);
router.get("/book-ride/:id", getRide);
router.post('/signup', upload.single("profilePicture"), signup);
router.post('/login', login);

// Export Controller
module.exports = router;