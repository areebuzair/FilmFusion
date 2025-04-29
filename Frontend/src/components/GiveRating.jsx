import React, { useState } from "react";
import axios from "axios";

export default function GiveRating({ movie_id }) {
  const [stars, setStars] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState("");

  const handleStarClick = (n) => {
    setStars(n);
    setShowReviewForm(true); // Show form after selecting stars
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.length > 250) {
      setError("Review must be under 250 characters.");
      return;
    }

    setError(""); 
    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:4500/film/movies/${movie_id}/rate-review`,
        {
          rating: stars,
          review: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Rating and Review submitted successfully:", response.data);

      // After successful post
      setStars(0);
      setReviewText("");
      setShowReviewForm(false);
      alert("Thanks for your feedback!");
    } catch (error) {
      console.error("Error submitting rating and review:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="movie-rating">
      <div className="stars" style={{ marginBottom: "10px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= stars ? "selected" : ""}`}
            onClick={() => handleStarClick(star)}
            style={{ cursor: "pointer", fontSize: "24px" }}
          >
            ★
          </span>
        ))}
      </div>

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} style={{ marginTop: "10px" }}>
          <textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              if (e.target.value.length > 250) {
                setError("Review must be under 250 characters.");
              } else {
                setError("");
              }
            }}
            rows="4"
            style={{ width: "100%", padding: "8px" }}
            required
          />

          <div style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}>
            Review must be under 250 characters. ({reviewText.length}/250)
          </div>

          {error && (
            <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || reviewText.length > 250}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              backgroundColor: loading ? "gray" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Posting..." : "Post Review"}
          </button>
        </form>
      )}
    </div>
  );
}
