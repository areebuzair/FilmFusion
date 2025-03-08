const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded({ extended: true });
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // Load the secret key from .env
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log("No token")
        return res.status(403).json({ message: "Access denied" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Invalid token")
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
};

// Example of a protected route
router.get("/protected", authenticateToken, (req, res) => {
    console.log("Protected Route Visited")
    res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router