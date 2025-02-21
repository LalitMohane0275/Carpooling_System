const express = require('express'); // Importing express
const router = express.Router(); // Creating a router
const { signup, login } = require('../controllers/loginSignUpController');
const upload = require("../utils/multer"); 
const {forgotPassword,verifyOTP,resetPassword,resendOTP} = require('../controllers/authController');

router.post('/signup', upload.single("profilePicture"), signup); 
router.post('/login', login); 


router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);

module.exports = router; 