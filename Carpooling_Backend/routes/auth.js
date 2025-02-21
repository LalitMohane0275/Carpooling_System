const express = require('express'); // Importing express
const router = express.Router(); // Creating a router
const { signup, login, changePassword, verifyEmail } = require('../controllers/loginSignUpController');
const upload = require("../utils/multer"); 
<<<<<<< HEAD
const {forgotPassword,verifyOTP,resetPassword,resendOTP} = require('../controllers/authController');
=======
const authMiddleware = require('../middlewares/auth-middleware'); 

>>>>>>> e2ec1d2a537680bbec48dfeeb7e29960fa12ff0a

router.post('/signup', upload.single("profilePicture"), signup); 
router.post('/login', login); 
router.post('/change-password', changePassword);
router.post('/verify-email', verifyEmail); // New endpoint


router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);

module.exports = router; 