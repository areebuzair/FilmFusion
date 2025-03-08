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

// to store the code in memory
const verificationCodes = new Map();

const generateSecureVerificationCode = () => {
    // return 100000;
    return crypto.randomInt(100000, 999999); //besi secure code hmmm
};

const JWT_SECRET = process.env.JWT_SECRET; // Load the secret key from .env
const getJWT = (user) => {
    return jwt.sign(
        { user_email: user.user_email },
        JWT_SECRET,
    );
}


const signup = async (req, res) => {
    try {

        const { useremail } = req;

        const verificationCode = generateSecureVerificationCode();

        verificationCodes.set(useremail, { ...req, verificationCode });
        console.log(useremail, verificationCode);

        setTimeout(() => {
            verificationCodes.delete(useremail);
            console.log(`Verification code for ${useremail} expired.`);
        }, 20 * 60 * 1000); // 20 minutes brother

        // right now its test account kosto
        // let testAccount = await nodemailer.createTestAccount();


        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PW,
            },
        });

        // Define the email message
        let message = {
            from: process.env.EMAIL, // Sender address
            to: useremail, // Send to the user's email
            subject: "FilmFusion Email Verification", // Subject line
            text: `Your verification code is: ${verificationCode}`, // Plain text body
            html: `<b>Your verification code is: </b><h1>${verificationCode}</h1> <br> Please use this code to verify your account.`, // HTML body
        };

        // Send the email
        let info = await transporter.sendMail(message);

        // Respond with a success message
        return res.status(201).json({
            msg: `Verification email sent to ${useremail}`,
            info: info.messageId,
            // preview: nodemailer.getTestMessageUrl(info)
            // URL for previewing the email in Ethereal
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: error.message });
    }
};


const verify = (req, res) => {
    const { useremail, code } = req.body;
    console.log(`Asked to verify code ${code} for ${useremail}`)
    let storedCode;
    try {
        storedCode = verificationCodes.get(useremail).verificationCode;
        console.log(storedCode);

        if (!storedCode) {
            return res.status(400).json({ msg: "No verification code found for this email or it has expired" });
        }
    }
    catch (e) {
        console.log(e)
        return res.status(400).json({ msg: "No verification code found for this email or it has expired" });
    }


    if (parseInt(code) === storedCode) {
        const user = verificationCodes.get(useremail);

        // Insert the new user into the database
        connection.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)",
            [user.username, useremail, user.hash],
            (insertError, insertResults) => {
                if (insertError) {
                    console.error("Error inserting user:", insertError);
                    return res.status(500).json({ error: "Failed to create user" });
                }

                const user = {
                    user_email: useremail
                }

                // Generate JWT Token
                const token = getJWT(user)

                console.log("User registered successfully");
                verificationCodes.delete(useremail);

                res.status(201).json({
                    message: "User registered successfully",
                    token,
                    user: user.username
                });
            }
        );
        // return res.status(200).json({ msg: "Email verified successfully" });
    } else {
        return res.status(400).json({ msg: "Invalid verification code" });
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
                return res.status(400).json({ error: "User already exists. Try Again" });
            }

            signup({ username, useremail, hash }, res);
        });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/verify", encoder, verify)

module.exports = router