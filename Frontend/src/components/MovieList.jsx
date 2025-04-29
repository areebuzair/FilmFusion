import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../provider/authProvider";
import GiveRating from "./GiveRating";
import { useNavigate } from "react-router-dom";
import "./MovieList.css"; // import the CSS file

function MovieList() {
  const [movies, setMovies] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:4500/film/movies");
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="movie-list">
      <h2 className="title">Movies List</h2>
      {movies.length === 0 ? (
        <p className="no-movies">No movies available.</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card" onClick={()=>{navigate(`/movie?id=${movie.id}`)}}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>
                  {movie.title} ({movie.release_year})
                </h3>
                <p>
                  <strong>Director:</strong> {movie.director}
                </p>

                {/* Rating Section */}
                <div className="movie-rating">
                  <span className="star">⭐</span>
                  <span>{movie.rating || "N/A"}</span>
                </div>

                {/* Conditionally render GiveRating component */}
                {token && <GiveRating movie_id={movie.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
