const express = require('express'); // Importing express
const router = express.Router(); // Creating a router
const { signup, login } = require('../controllers/loginSignUpController');
const upload = require("../utils/multer"); 

router.post('/signup', upload.single("profilePicture"), signup); 
router.post('/login', login); 

module.exports = router; 