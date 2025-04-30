import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Recommendations.css";
import Header from "../components/Header";

function Recommendations() {
  const [genreInput, setGenreInput] = useState("");
  const [genresOptions, setGenresOptions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = () => {
    setIsLoading(true);
    const genres = selectedGenres;

    fetch("http://localhost:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genres }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get("http://localhost:4500/film/genres");
        setGenresOptions(res.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      <div className="recommendations-container">
        <h2 className="recommendations-title">Get Movie Recommendations</h2>

        <div className="genres-selection">
          <p>Select your preferred genres:</p>
          <div className="genres-grid">
            {genresOptions.map((genre) => (
              <div className="genre-item" key={genre.id}>
                <label>
                  <input
                    type="checkbox"
                    className="genre-checkbox"
                    value={genre.id}
                    checked={selectedGenres.includes(genre.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGenres([...selectedGenres, genre.name]);
                      } else {
                        setSelectedGenres(
                          selectedGenres.filter((name) => name !== genre.name)
                        );
                      }
                    }}
                  />
                  {genre.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {selectedGenres.length > 0 && (
          <div className="selected-genres-display">
            <strong>Selected genres:</strong> {selectedGenres.join(", ")}
          </div>
        )}

        {selectedGenres.length > 0 && (
          <button
            className="recommend-button"
            onClick={handleFetch}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Recommendations"}
          </button>
        )}

        {recommendations.length > 0 && (
          <ul className="recommendations-list">
            {recommendations.map((movie, index) => (
              <li className="recommendation-item" key={index}>
                <div className="movie-title">
                  <strong>{movie.title}</strong> ({movie.year || "N/A"})
                </div>
                <div className="movie-genres">{movie.genres}</div>
                <div className="movie-rating">
                  Rating: {movie.rating?.toFixed(1) || "N/A"}
                </div>
              </li>
            ))}
          </ul>
        )}

        {recommendations.length === 0 &&
          !isLoading &&
          selectedGenres.length > 0 && (
            <p className="no-results">
              No recommendations found. Try different genres.
            </p>
          )}
      </div>
    </>
  );
}

export default Recommendations;
