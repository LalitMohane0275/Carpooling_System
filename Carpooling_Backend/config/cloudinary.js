const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
// cloud_name: "dxuxjltav",
// api_key: 288955458792195,
// api_secret: "36rFQxqeibmumXWfGOCCFCle7T4",