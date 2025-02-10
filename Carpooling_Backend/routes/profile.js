const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const {
  getProfile,
} = require("../controllers/profileController");


// Route to fetch profile data (optional, if needed)
router.get("/get-profile/:userName", authMiddleware, getProfile);

module.exports = router;
