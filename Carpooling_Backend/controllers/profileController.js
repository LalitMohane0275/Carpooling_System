// const Profile = require("../models/Profile"); // Import Profile model


// // Cloudinary Configuration
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,

// // Get profile data (optional)
// exports.getProfile = async (req, res) => {
//   try {
//     const { userName } = req.params; // Get userName from the URL

//     // Find the profile by userName
//     const profile = await Profile.findOne({ userName });

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: "Profile not found",
//       });
//     }

//     // Return the profile data
//     res.status(200).json({
//       success: true,
//       data: profile,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//       error: error.message,
//     });
//   }
// };

