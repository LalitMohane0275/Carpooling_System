const express = require('express');
const carpool = require('./routes/carpool');
const cors = require("cors");

const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(cors());
// middleware 
app.use(express.json());


// mount 
app.use("/api/v1",carpool);

const dbConnect = require('./config/database');
dbConnect();

// Start Server 
app.listen(PORT,()=>{
    console.log("App is Running at the",PORT);
})

// Default Route 
app.get('/', (req,res) => {
    res.send(`<h1>HomePage</h1>`)
})