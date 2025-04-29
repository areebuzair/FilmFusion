import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';
import GiveRating from '../components/GiveRating';

export default function MovieDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movie, setMovie] = useState();
  const { token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    let id = searchParams.get("id");
    if (!id) {
      navigate("/");
    }
    const [searchParams] = useSearchParams();
    const [movie, setMovie] = useState(null);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [watchlistMessage, setWatchlistMessage] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate();

    const movieId = searchParams.get("id");

    useEffect(() => {
        if (!movieId) {
            navigate("/");
            return;
        }

        const fetchMovie = async () => {
            try {
                const res = await axios.get(`http://localhost:4500/film/movies/${movieId}`);
                setMovie(res.data);
            } catch (error) {
                console.error("Error fetching movie details", error);
            }
        };

        const fetchWatchlistStatus = async () => {
            try {
                const res = await axios.get(`http://localhost:4500/film/watchlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const isInWatchlist = res.data.watchlist?.some((item) => item.id === parseInt(movieId));
                setInWatchlist(isInWatchlist);
            } catch (error) {
                console.error("Error checking watchlist status", error);
            }
        };

        fetchMovie();
        if (token) fetchWatchlistStatus();
    }, [movieId]);

    const toggleWatchlist = async () => {
        if (!token || !movie) return;

        try {
            if (inWatchlist) {
                await axios.delete(
                    `http://localhost:4500/film/movies/${movie.movie.id}/watchlist`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setInWatchlist(false);
                setWatchlistMessage("❌ Removed from watchlist.");
            } else {
                await axios.post(
                    `http://localhost:4500/film/movies/${movie.movie.id}/watchlist`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setInWatchlist(true);
                setWatchlistMessage("✅ Added to watchlist.");
            }
        } catch (error) {
            console.error("Error updating watchlist", error);
            setWatchlistMessage("⚠️ Error updating watchlist.");
        }
    };

    return (
        <>
            {movie && (
                <div>
                    <h2>Movie Details</h2>
                    <img
                        src={movie.movie.poster_url}
                        alt={movie.movie.title}
                        className="movie-poster"
                    />
                    <div className="movie-info">
                        <h3>{movie.movie.title} ({movie.movie.release_year})</h3>
                        <p><strong>Director:</strong> {movie.movie.director}</p>

                        <div className="movie-rating">
                            <span className="star">⭐</span>
                            <span>{movie.movie.rating || "N/A"}</span>
                        </div>

                        {token && (
                            <div style={{ margin: "10px 0" }}>
                                <button
                                    onClick={toggleWatchlist}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: inWatchlist ? "#dc3545" : "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                >
                                    {inWatchlist ? "➖ Remove from Watchlist" : "➕ Add to Watchlist"}
                                </button>
                                {watchlistMessage && (
                                    <div style={{ marginTop: "6px", fontSize: "13px", color: "gray" }}>
                                        {watchlistMessage}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <h3>Actors</h3>
                    <ol>
                        {movie.actors.map((actor) => (
                            <li key={actor.id}>{actor.first_name + ' ' + actor.last_name}</li>
                        ))}
                    </ol>

                    <h3>Genres</h3>
                    <ol>
                        {movie.genres.map((genre) => (
                            <li key={genre}>{genre}</li>
                        ))}
                    </ol>

                    <h3>Reviews</h3>
                    {token && <GiveRating movie_id={movie.movie.id} />}
                    <ol>
                        {movie.reviews.map((review) => (
                            <li key={review.id}>
                                User Id: {review.user_id} <br />
                                Rating: {review.rating} <br />
                                Review: {review.review}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </>
    );
}
