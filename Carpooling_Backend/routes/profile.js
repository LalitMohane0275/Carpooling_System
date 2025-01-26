const express = require("express");
const router = express.Router();
const {
  uploadProfile,
  getProfile,
} = require("../controllers/profileController");
const upload = require("../utils/multer"); // For handling file uploads

// Route to handle profile creation or update
router.post("/", upload.single("profilePicture"), uploadProfile);

// Route to fetch profile data (optional, if needed)
router.get("/:id", getProfile);

module.exports = router;
