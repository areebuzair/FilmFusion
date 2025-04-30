import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GiveRating.css";

export default function GiveRating({ movie_id }) {
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false); // whether user already submitted
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    // Fetch user's existing rating/review
    const fetchMyRating = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:4500/film/movies/${movie_id}/my-rate-review`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setStars(response.data.rating || 0);
          setReviewText(response.data.review || "");
          setIsUpdating(true);
        }
      } catch (error) {
        console.error("Could not fetch user rating", error);
      } finally {
        setInitialLoadDone(true);
      }
    };

    fetchMyRating();
  }, [movie_id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (reviewText.length > 250) {
      setError("Review must be under 250 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if(!isUpdating){
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
        console.log("Submitted successfully:", response.data);
      }
      else{
        const response = await axios.put(
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
        console.log("Submitted successfully:", response.data);
      }

      setIsUpdating(true);
      alert("Review saved!");
    } catch (error) {
      console.error("Error submitting rating and review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (n) => {
    setStars(n);
  };

  if (!initialLoadDone) return <p>Loading your rating...</p>;

  return (
    <>
      <div className="movie-rating">
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= stars ? "selected" : ""}`}
              onClick={() => handleStarClick(star)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                color: star <= stars ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <form onSubmit={handleReviewSubmit} style={{ marginTop: "10px" }}>
          <textarea
          
          placeholder={movie_id==217?"Remember the first rule of fight club":"Leave a review"}
            
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
            style={{ padding: "8px" }}
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
            {loading
              ? "Posting..."
              : isUpdating
              ? "Update Review"
              : "Post Review"}
          </button>
        </form>
      </div>
    </>
  );
}
