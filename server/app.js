// app.js

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pg = require('pg');
const ejs = require("ejs");

const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = new pg.Client({
    host: "localhost",
    user: "postgres",
    database: "temp",
    password: "Lalit&",
    port: 5432
});

db.connect();

async function checkPublished() {
    try {
        const result = await db.query("SELECT start_location, destination, leaving_time, charges, seats, preference FROM ride");
        return result.rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Public", "pages"));

app.use("/", express.static(path.join(__dirname, '/Public')));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/submitRide", async (req, res) => {
    const { start_location, destination, leaving_time, charges, seats, preference } = req.body;

    console.log(start_location, destination, leaving_time, charges, seats, preference);

    await db.query("INSERT INTO ride (start_location, destination, leaving_time, charges, seats, preference) VALUES ($1, $2, $3, $4, $5, $6)", [
        start_location, destination, leaving_time, charges, seats, preference
    ]);

    res.sendFile(path.join(__dirname, "Public/pages/publishRide.html"));
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
