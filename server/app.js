// app.js
// dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pg = require('pg');
const ejs = require("ejs");

const app = express();
const port = 3000;

// // for ejs and static directory
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// to use postgresql
const db = new pg.Client({
    host: "localhost",
    user: "postgres",
    database: "temp",
    password: "Lalit&",
    port: 5432
});

db.connect();

// functions to fectch the published rides from the database
async function checkPublished() {
    try {
        const result = await db.query("SELECT start_location, destination, leaving_time, charges, seats, preference FROM ride");
        return result.rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

async function checkPublished1(start, destination) {
    try {
        const result = await db.query("SELECT start_location, destination, leaving_time, charges, seats, preference FROM ride WHERE start_location = $1 and destination = $2", 
        [start, destination]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// to use ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Public", "pages"));

// static directory
app.use("/", express.static(path.join(__dirname, '/Public')));
app.use(bodyParser.urlencoded({ extended: true }));


// get and post requests
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/Public/pages/login.html"));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [
            username,
            password
        ]);

        if (result.rows.length > 0) {
            res.redirect('/');
        } else {
            alert("Invalid Credentials");
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.redirect('/login');
    }
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "Public/pages/signup.html"));
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = { username, email, password };
        await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
            newUser.username,
            newUser.email,
            newUser.password
        ]);

        res.redirect('/');  // Redirect to the /index route
    } catch (error) {
        console.error('Error during signup:', error);

        if (error.code === '23505') {
            // Unique violation (duplicate key), handle accordingly
            res.status(400).send({ status: 400, message: 'Username or email already exists' });
        } else {
            res.status(500).send({ status: 500, message: 'Error creating the user' });
        }
    }
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/index.html");
});

app.get("/publishRide", (req, res) => {
    res.sendFile(path.join(__dirname, "Public/pages/publishRide.html"));
});

app.get("/searchRide", async (req, res) => {
    try {
        const rides = await checkPublished();
        res.render("searchRide", { rides });
    } catch (error) {
        console.error("Error in /searchRide:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/about.html");
});

app.get("/profile", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/profile.html");
});

app.get("/manageProfile", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/manageProfile.html");
});

app.get("/reviews", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/reviews.html");
});

app.get("/sharedRides", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/recent_rides_joined.html");
});

app.get("/publishedRides", (req, res) => {
    res.sendFile(__dirname + "/Public/pages/recent_rides_created.html");
});

app.post("/submitRide", async (req, res) => {
    const { start_location, destination, leaving_time, charges, seats, preference } = req.body;

    console.log(start_location, destination, leaving_time, charges, seats, preference);

    await db.query("INSERT INTO ride (start_location, destination, leaving_time, charges, seats, preference) VALUES ($1, $2, $3, $4, $5, $6)", [
        start_location, destination, leaving_time, charges, seats, preference
    ]);

    res.sendFile(path.join(__dirname, "Public/pages/publishRide.html"));
});


app.post("/searchRide", async (req, res) => {
    try {
        const { source, destination } = req.body;
        const rides = await checkPublished1(source, destination);
        res.render("searchRide", { rides });
    } catch (error) {
        console.error("Error in /searchRide:", error);
        res.status(500).send("Internal Server Error");
    }
});

// app.get("/bookRide", async (req, res) => {
//     // Retrieve ride details from query parameters
//     const { start_location, destination, leaving_time, charges, seats, preference } = req.query;

//     // You can render a page with a form where the user can confirm the booking details
//     // Example:
//     res.render("confirmBooking", { start_location, destination, leaving_time, charges, seats, preference });
// });

app.post("/bookRide", async (req, res) => {
    const { start_location, destination, leaving_time, charges, seats, preference } = req.body;

    try {
        // Assuming you have a rides table in your database
        // Update the database to decrease available seats for the selected ride
        const updateResult = await db.query("UPDATE ride SET seats = seats - 1 WHERE start_location = $1 AND destination = $2 AND leaving_time = $3", [
            start_location, destination, leaving_time
        ]);

        if (updateResult.rowCount === 0) {
            // If no rows were affected, it means the ride wasn't found
            return res.status(404).send("Ride not found or already fully booked.");
        }

        // Perform any additional booking logic here, such as creating a new booking entry in your database

        // Redirect to the searchRide page after successful booking
        res.redirect("/searchRide");
    } catch (error) {
        console.error("Error booking ride:", error);
        res.status(500).send("Error booking ride. Please try again later.");
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});