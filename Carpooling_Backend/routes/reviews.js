const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/auth-middleware'); 

router.post('/submit', authMiddleware, reviewController.submitReview);
router.get('/:rideId', authMiddleware, reviewController.getReviews);

module.exports = router;