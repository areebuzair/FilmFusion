import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./MoviesByGenres.css";
import Header from "../components/Header";

export default function MoviesByGenres() {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState("year"); // 'year' or 'rating'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");

  useEffect(() => {
    if (!genre) {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4500/film/moviesbygenre/${genre}`
        );
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching movie details", error);
      }
    };
    fetchData();
  }, [genre, navigate]);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "year") {
      return b.release_year - a.release_year; // Newest first
    } else {
      return b.rating - a.rating; // Highest rated first
    }
  });

  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      <div className="genre-movies-container">
        {movies.length !== 0 && (
          <>
            <div className="genre-header">
              <h2 className="genre-title">{genre} Movies</h2>
              <div className="sort-controls">
                <button
                  className={`sort-btn ${sortBy === "year" ? "active" : ""}`}
                  onClick={() => setSortBy("year")}
                >
                  Sort by Year
                </button>
                <button
                  className={`sort-btn ${sortBy === "rating" ? "active" : ""}`}
                  onClick={() => setSortBy("rating")}
                >
                  Sort by Rating
                </button>
              </div>
            </div>
            <ul className="movies-list">
              {sortedMovies.map((movie) => (
                <li
                  key={movie.movie_id}
                  className="movie-item"
                  onClick={() => navigate(`/movie?id=${movie.movie_id}`)}
                >
                  <span className="movie-title">
                    {movie.title}
                    <span className="movie-year"> ({movie.release_year})</span>
                  </span>
                  <span className="movie-rating">
                    {movie.rating ? `${movie.rating} ★` : "No rating"}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
