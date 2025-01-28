const express = require("express");
const router = express.Router();
const {
  getProfile,
} = require("../controllers/profileController");


// Route to fetch profile data (optional, if needed)
router.get("/get-profile/:userName", getProfile);

module.exports = router;
