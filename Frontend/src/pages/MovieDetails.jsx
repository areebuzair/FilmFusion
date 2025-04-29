import React from "react";
import GiveRating from "../components/GiveRating";
import { useAuth } from "../provider/authProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import Header from "../components/Header";

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

    const fetchMovies = async () => {
      try {
        const res = await axios.get(`http://localhost:4500/film/movies/${id}`);
        setMovie(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };
    fetchMovies();
  }, []);
  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      {movie && (
        <div className="movie-details-container">
          <div className="poster-container">
            <img src={movie.movie.poster_url} alt={movie.movie.title} />
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
                <li key={actor.id}>
                  {actor.first_name} {actor.last_name}
                </li>
              ))}
            </ol>

            <div className="section-title">Genres</div>
            <ol>
              {movie.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ol>

            <div className="section-title">Reviews</div>
            {token && <GiveRating movie_id={movie.movie.id} />}
            {/* Updated reviews section with empty state handling */}
            {movie.reviews.length > 0 ? (
              <ol className="reviews-list">
                {movie.reviews.map((review) => (
                  <li key={review.id} className="review-item">
                    <div>
                      <strong>User Id:</strong> {review.user_id}
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
          </div>
        </div>
      )}
    </>
  );
}
