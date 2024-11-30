const express = require('express');
const router = express.Router();

// Import Controller 
const {createRide} = require("../controllers/createRideController");
const {getRides} = require("../controllers/getRideController");

// Mapping Create
router.post("/create-ride",createRide)
router.get("/book-ride", getRides)

// Export Controller
module.exports = router;