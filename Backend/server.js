const express = require("express");
const cors = require("cors");
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:5432");
});

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "SousChef"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});
