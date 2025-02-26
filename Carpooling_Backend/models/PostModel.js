const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  category: {
    type: String,
    enum: ["Thought", "Traffic Update", "Ride Experience", "Weather", "Route Share"], // Added Weather, Route Share
    required: true,
  },
  reactions: {
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    smile: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    love: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Added love
    star: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Added star
    award: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Added award
  },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);