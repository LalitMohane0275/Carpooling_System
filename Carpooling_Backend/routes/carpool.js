const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");


// Import Controller 
const {createRide, createPassengerRide} = require("../controllers/createRideController");
const {getRide, getRides} = require("../controllers/getRideController");


// Mapping Create
router.post("/create-ride", authMiddleware, createRide);
router.post("/create-passenger-ride/:id", authMiddleware, createPassengerRide);
router.get("/find-ride", authMiddleware, getRides);
router.get("/book-ride/:id", authMiddleware, getRide);

// Export Controller
module.exports = router;