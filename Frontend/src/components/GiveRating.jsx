import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GiveRating({ movie_id }) {
  const [stars, setStars] = useState(0);

  const handleUpdate = async (n) => {
    setStars(n);
    console.log(movie_id, n);

    try {
      const response = await axios.post(
        `http://localhost:4500/film/movies/${movie_id}/rate-review`,
        {
          rating: n,
        }
      );
      console.log("Rating submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="movie-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= stars ? "selected" : ""}`}
          onClick={() => handleUpdate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
