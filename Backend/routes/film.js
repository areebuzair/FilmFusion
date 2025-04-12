const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded({ extended: true });
const jwt = require("jsonwebtoken");
const connection = require('../DataBaseConnection');

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

// =========================
// Movies Endpoints
// =========================

// Get all movies
router.get('/movies', (req, res) => {
    connection.query("SELECT * FROM movies", (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching movies', error: err });
        res.json(results);
    });
});

// Add a new movie (Requires authentication)
router.post('/movies', authenticateToken, (req, res) => {
    const { title, release_year, director, rating, genres, poster_url } = req.body;
    if (!title || !release_year || !director || !poster_url) return res.status(400).json({ message: 'Missing required fields' });

    console.log(genres)

    connection.query("INSERT INTO movies (title, release_year, director, rating, poster_url) VALUES (?, ?, ?, ?, ?)",
        [title, release_year, director, rating, poster_url], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding movie', error: err });

            const movieId = result.insertId;
            if (genres && genres.length > 0) {
                genres.forEach(genreName => {
                    connection.query("INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, (SELECT id FROM genres WHERE name = ?))",
                        [movieId, genreName], (err) => {
                            if (err) console.error('Error linking movie to genre:', err);
                        });
                });
            }
            res.status(201).json({ message: 'Movie added successfully', movieId });
        });
});

// =========================
// Genre Endpoints
// =========================

// Get all genres
router.get('/genres', (req, res) => {
    connection.query("SELECT * FROM genres", (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching genres', error: err });
        res.json(results);
    });
});

// Add genres (Requires authentication)
router.post('/genres', authenticateToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Genre name is required' });

    connection.query("INSERT INTO genres (name) VALUES (?)", [name], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding genre', error: err });
        res.status(201).json({ message: 'Genre added successfully', genreId: result.insertId });
    });
});

// =========================
// Actor Endpoints
// =========================

// Get all actors
router.get('/actors', (req, res) => {
    connection.query("SELECT * FROM actors", (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching actors', error: err });
        res.json(results);
    });
});

// Add a new actor (Requires authentication)
router.post('/actors', authenticateToken, (req, res) => {
    const { first_name, last_name, dob } = req.body;
    if (!first_name || !last_name) return res.status(400).json({ message: 'Missing required fields' });

    connection.query("INSERT INTO actors (first_name, last_name, dob) VALUES (?, ?, ?)",
        [first_name, last_name, dob], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding actor', error: err });
            res.status(201).json({ message: 'Actor added successfully', actorId: result.insertId });
        });
});


// =========================
// Rating & Review Endpoints
// =========================

// Add a rating and review for a movie (Requires authentication)
router.post('/movies/:id/rate-review', authenticateToken, (req, res) => {
    const movieId = req.params.id;
    const { rating, review } = req.body;
    const userId = req.params.user_id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    connection.query(
        "INSERT INTO movie_reviews (movie_id, user_id, rating, review) VALUES (?, ?, ?, ?)",
        [movieId, userId, rating, review],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding rating and review', error: err });
            res.status(201).json({ message: 'Rating and review added successfully' });
        }
    );
});

// Get all ratings and reviews for a movie
router.get('/movies/:id/rate-review', (req, res) => {
    const movieId = req.params.id;

    connection.query(
        "SELECT r.rating, r.review, u.username FROM movie_reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = ?",
        [movieId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching ratings and reviews', error: err });
            res.json(results);
        }
    );
});
// =========================
// Watchlist Endpoints
// =========================

// Add a movie to the user's watchlist (Requires authentication)
router.post('/watchlist', authenticateToken, (req, res) => {
    const { user_id, movie_id } = req.body;

    if (!user_id || !movie_id) {
        return res.status(400).json({ message: 'User ID and Movie ID are required' });
    }

    connection.query(
        "INSERT INTO watchlist (user_id, movie_id, watched) VALUES (?, ?, False)",
        [user_id, movie_id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding movie to watchlist', error: err });
            res.status(201).json({ message: 'Movie added to watchlist successfully' });
        }
    );
});

// Get the user's watchlist
router.get('/watchlist/:user_id', authenticateToken, (req, res) => {
    const userId = req.params.user_id;

    connection.query(
        "SELECT w.movie_id, m.title, m.release_year, m.director, w.watched FROM watchlist w JOIN movies m ON w.movie_id = m.id WHERE w.user_id = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching watchlist', error: err });
            res.json(results);
        }
    );
});

// Update the watched status of a movie in the user's watchlist (Requires authentication)
router.put('/watchlist/:user_id/:movie_id', authenticateToken, (req, res) => {
    const { user_id, movie_id } = req.params;
    const { watched } = req.body;

    if (watched === undefined) {
        return res.status(400).json({ message: 'Watched status is required' });
    }

    connection.query(
        "UPDATE watchlist SET watched = ? WHERE user_id = ? AND movie_id = ?",
        [watched, user_id, movie_id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error updating watchlist', error: err });
            res.json({ message: 'Watchlist updated successfully' });
        }
    );
});



module.exports = router