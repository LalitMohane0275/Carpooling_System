const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
<<<<<<< HEAD
  cloud_name: "dcoqj7jac",
  api_key: 471899233913458,
  api_secret: "PW1ft2qBTw8pAHMAnApwZ_KNnL8",
=======
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
>>>>>>> e2ec1d2a537680bbec48dfeeb7e29960fa12ff0a
});

module.exports = cloudinary;
// cloud_name: "dxuxjltav",
// api_key: 288955458792195,
// api_secret: "36rFQxqeibmumXWfGOCCFCle7T4",