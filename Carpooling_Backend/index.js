const express = require("express");
const carpool = require("./routes/carpool");
const profile = require("./routes/profile"); 
const auth = require("./routes/auth");
const path = require("path");
const reviews = require("./routes/reviews");
const notificationRoutes = require('./routes/notifications');


const cors = require("cors");
const dbConnect = require("./config/database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To handle form submissions

// Database Connection
dbConnect();

// Mount Routes
app.use("/api/v1", carpool);
app.use("/api/v1/profile", profile); 
app.use("/api/v1/auth", auth);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/reviews", reviews);
app.use('/api/v1/notifications', notificationRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send(`<h1>HomePage</h1>`);
});

// Start Server
app.listen(PORT, () => {
  console.log(`App is running at PORT ${PORT}`);
});
