const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");



// Import Controller 
const {createRide, createPassengerRide} = require("../controllers/createRideController");
const {getRide, getRides, getRidesByDriverId, getPassengerRidesByPassengerId} = require("../controllers/getRideController");
const { createOrder, verifyPayment } = require("../controllers/PaymentController");


// Mapping Create
router.post("/create-ride", authMiddleware, createRide);
router.post("/create-passenger-ride/:id", authMiddleware, createPassengerRide);
router.get("/find-ride", authMiddleware, getRides);
router.get("/book-ride/:id", authMiddleware, getRide);
router.get("/get-rides/:driver", authMiddleware, getRidesByDriverId);
router.get("/get-passenger-rides/:passenger", authMiddleware, getPassengerRidesByPassengerId);
// Route to Create Order
router.post("/create-order", createOrder);

// Route to Verify Payment (Optional)
router.post("/verify-payment", verifyPayment);

// Export Controller
module.exports = router;







module.exports = router;
