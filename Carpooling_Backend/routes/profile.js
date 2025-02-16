const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const { getProfile ,updateProfile} = require("../controllers/profileController");


// Route to fetch profile data 
router.get("/get-profile/:userId", authMiddleware, getProfile);
router.put("/edit-profile/:userId", updateProfile);




module.exports = router;
