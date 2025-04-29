import React from "react";
import GiveRating from "../components/GiveRating";
import { useAuth } from "../provider/authProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import Header from "../components/Header";

export default function MovieDetails() {
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
        const res = await axios.get(
          `http://localhost:4500/film/movies/${movieId}`
        );
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

        const isInWatchlist = res.data.some(
          (item) => item.movie_id === parseInt(movieId)
        );
        setInWatchlist(isInWatchlist);
      } catch (error) {
        console.error("Error checking watchlist status", error);
      }
    };

    fetchMovie();
    if (token) fetchWatchlistStatus();
  }, [movieId, token]);

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
      <div className="Header">
        <Header />
      </div>
      {movie && (
        <div className="movie-details-container">
          <div className="poster-container">
            <img src={movie.movie.poster_url} alt={movie.movie.title} />

            {/* Rating Distribution Graph */}
            <div className="rating-distribution">
              <h3>Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = movie.reviews.filter(
                  (r) => r.rating === rating
                ).length;
                const total = movie.reviews.length;
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={rating} className="rating-bar-container">
                    <div className="rating-label">
                      <span>{rating} ★</span>
                      <span>
                        {count} {count === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                    <div className="rating-bar">
                      <div
                        className="rating-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="details-content">
            <h2>
              {movie.movie.title} ({movie.movie.release_year})
            </h2>
            <p>
              <strong>Director:</strong> {movie.movie.director}
            </p>
            <div className="movie-rating">
              <span>⭐</span>
              <span>{movie.movie.rating || "N/A"}</span>
            </div>

            <div className="section-title">Actors</div>
            <ol>
              {movie.actors.map((actor) => (
                <li key={actor.id} onClick={()=>{navigate(`/actor?id=${actor.id}`)}}>
                  {actor.first_name} {actor.last_name}
                </li>
              ))}
            </ol>

            <div className="section-title">Genres</div>
            <ol>
              {movie.genres.map((genre) => (
                <li key={genre} onClick={()=>{navigate(`/moviesbygenre?genre=${genre}`)}}>{genre}</li>
              ))}
            </ol>

            <div className="section-title">Reviews</div>
            {token && <GiveRating movie_id={movie.movie.id} />}
            {movie.reviews.length > 0 ? (
              <ol className="reviews-list">
                {movie.reviews.map((review) => (
                  <li key={review.id} className="review-item">
                    <div>
                      <strong>User Name:</strong> {review.user_name}
                    </div>
                    <div>
                      <strong>Rating:</strong> {review.rating}
                    </div>
                    <div>
                      <strong>Review:</strong> {review.review}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="no-reviews">
                No reviews yet. Be the first to review!
              </div>
            )}

            {token && (
              <div style={{ margin: "20px 0" }}>
                <button
                  onClick={toggleWatchlist}
                  className={`watchlist-btn ${inWatchlist ? "remove" : ""}`}
                >
                  {inWatchlist
                    ? "➖ Remove from Watchlist"
                    : "➕ Add to Watchlist"}
                </button>
                {watchlistMessage && (
                  <div className="watchlist-message">{watchlistMessage}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
