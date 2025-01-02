const express = require('express');
const router = express.Router();

// Import Controller 
const { createRide, createPassengerRide } = require("../controllers/createRideController");
const { getRide, getRides, searchRides } = require("../controllers/getRideController");
const { signup, login } = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/AuthMiddleware');

// Mapping Create
router.post("/create-ride", createRide);
router.post("/create-passengerRide/:id", createPassengerRide);
router.get("/find-rides", getRides);
router.get("/book-ride/:id", getRide);
router.post('/signup', signup);
router.post('/login', login);
router.post('/rides/search-rides', searchRides);

router.get("/test", verifyToken, (req, res)=>{
    res.json({
        success:true,
        message: "Welcome to the protected route for tests"
    });
})

// Export Controller
module.exports = router;