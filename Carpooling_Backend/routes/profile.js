const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const { getProfile } = require("../controllers/profileController");


// Route to fetch profile data 
router.get("/get-profile/:userId", authMiddleware, getProfile);

module.exports = router;
