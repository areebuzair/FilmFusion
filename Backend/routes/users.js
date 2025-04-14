const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded({ extended: true });
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const connection = require('../DataBaseConnection');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');


const JWT_SECRET = process.env.JWT_SECRET; // Load the secret key from .env
const getJWT = (user) => {
    return jwt.sign(
        { user_email: user.user_email },
        JWT_SECRET,
    );
}


const signup = async (req, res) => {
    try {

        console.log("Begin sign up processs")
        // Insert the new user into the database
        connection.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)",
            [req.username, req.useremail, req.hash],
            (insertError, insertResults) => {
                if (insertError) {
                    console.error("Error inserting user:", insertError);
                    return res.status(500).json({ error: "Failed to create user" });
                }

                const user = {
                    user_email: req.useremail
                }

                // Generate JWT Token
                const token = getJWT(user)

                console.log("User registered successfully");

                res.status(201).json({
                    message: "User registered successfully",
                    token,
                    user: user.username
                });
            }
        );

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: error.message });
    }
};


// Login Route
router.post("/login", async (req, res) => {
    const { useremail, password } = req.body;

    console.log("POST request received at /user/login");
    console.log("useremail:", useremail);

    try {
        connection.query(
            "SELECT * FROM users WHERE user_email = ?",
            [useremail],
            async (error, results) => {
                if (error) {
                    console.error("Database query error:", error);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                if (results.length === 0) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.user_password);

                if (passwordMatch) {
                    // Generate JWT Token
                    const token = getJWT(user)

                    return res.status(200).json({
                        message: "Login successful",
                        token,
                        user: user.user_name
                    });
                } else {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
            }
        );
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/signup", async (req, res) => {
    const { username, useremail, password } = req.body;

    console.log("POST request received at /signup", { username, useremail });

    try {
        // Hash the password
        const hash = await bcrypt.hash(password, 11);

        // Check if the user already exists
        connection.query("SELECT * FROM users WHERE user_email = ?", [useremail], async (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.length > 0) {
                console.log("User email exists already")
                return res.status(400).json({ error: "User email already exists. Try Again" });
            }

            signup({ username, useremail, hash }, res);
        });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router