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
        const result = await db.query("SELECT * FROM ride");
        return result.rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

async function checkPublished1(start, destination) {
    try {
        const result = await db.query("SELECT * FROM ride WHERE start_location = $1 and destination = $2",
            [start, destination]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// var book_id = NULL;



// to use ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Public", "pages"));

// static directory
app.use("/", express.static(path.join(__dirname, '/Public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



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

app.post('/bookRide', (req, res) => {
    const requestData = req.body;
    const id = requestData.id;
    const seats = requestData.seats;

    // Construct the SQL query to select available seats for the given ride ID
    const selectQuery = 'SELECT seats FROM ride WHERE id = $1';

    // Execute the select query to get the available seats
    db.query(selectQuery, [id], (selectError, selectResults) => {
        if (selectError) {
            console.error('Error selecting available seats:', selectError);
            return res.status(500).send('Error selecting available seats');
        }

        if (selectResults.rows.length === 0) {
            console.error('No ride found with the provided ID');
            return res.status(404).send('No ride found with the provided ID');
        }

        const availableSeats = selectResults.rows[0].seats;

        if (availableSeats < seats) {
            console.error('Not enough available seats');
            return res.status(400).send('Not enough available seats');
        }

        // Construct the SQL query to update the seats for the given ride ID
        const updateQuery = 'UPDATE ride SET seats = seats - $1 WHERE id = $2';

        // Execute the update query with the provided parameters
        db.query(updateQuery, [seats, id], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error updating database:', updateError);
                return res.status(500).send('Error updating database');
            }
            console.log('Seats updated successfully');
            res.redirect("/searchRide?success=Ride booked successfully");
        });
    });
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});