const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config(); // Add this at the top of your file


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

const router = express.Router()

// Ensure the 'uploads' directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // save to the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Set up an endpoint to handle image uploads
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload an image.' });
    }
    res.json({ message: 'Image uploaded successfully', file: req.file, url: "http://localhost:4500/images/image/" + req.file.filename });
});

router.get('/upload', (req, res) => {
    res.json({ message: 'Images can be uploaded here'} );
});

// GET endpoint to retrieve an image by its filename
router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, { root: '.' });
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

module.exports = router