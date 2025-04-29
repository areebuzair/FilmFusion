import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserHomePage.css";
import Header from "../components/Header";

function CollapsibleSection({ title, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="uh-collapsible-section">
      <div
        className={`uh-section-header ${isCollapsed ? "collapsed" : ""}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3>{title}</h3>
        <span className="uh-toggle-icon">▼</span>
      </div>
      {!isCollapsed && <div className="uh-section-content">{children}</div>}
    </div>
  );
}

export default function UserHomePage() {
  const [watchList, setWatchList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [genreCounts, setGenreCounts] = useState({});
  const [ratingDist, setRatingDist] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(`http://localhost:4500/film/watchlist`);
        setWatchList(res.data);
      } catch (error) {
        console.error("Error fetching watchlist", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4500/film/movies/myreviews`
        );
        const reviews = res.data;
        setReviewList(reviews);

        // Average Rating
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          setAvgRating((totalRating / reviews.length).toFixed(2));
        }

        // Genre Counts
        const genreMap = {};
        reviews.forEach((r) => {
          const genres = r.genres ? r.genres.split(",") : [];
          genres.forEach((g) => {
            const trimmed = g.trim();
            genreMap[trimmed] = (genreMap[trimmed] || 0) + 1;
          });
        });
        delete genreMap.Uncategorized;
        setGenreCounts(genreMap);

        // Rating Distribution
        const ratingMap = {};
        reviews.forEach((r) => {
          const rate = r.rating;
          ratingMap[rate] = (ratingMap[rate] || 0) + 1;
        });
        setRatingDist(ratingMap);
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchWatchlist();
    fetchReviews();
  }, []);

  // Find most watched genre
  const mostWatchedGenre = Object.entries(genreCounts).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["None", 0]
  )[0];

  return (
    <>
      <div className="Header">
        <Header />
      </div>
      <div className="uh-container">
        <h2 className="user-home-header">User Home Page</h2>

        <CollapsibleSection title="Your Stats">
          <div className="uh-stats-container">
            <div className="uh-stat-item">
              <strong>Number of Reviews Written:</strong> {reviewList.length}
            </div>
            <div className="uh-stat-item">
              <strong>Total Movies in Watchlist:</strong> {watchList.length}
            </div>
            <div className="uh-stat-item">
              <strong>Average Rating Given:</strong> {avgRating}
            </div>
            <div className="uh-stat-item">
              <strong>Most Watched Genre:</strong> {mostWatchedGenre}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Your Watchlist">
          <div className="uh-watchlist-grid">
            {watchList.map((movie) => (
              <div
                key={movie.movie_id}
                className="uh-watchlist-item"
                onClick={() => navigate(`/movie?id=${movie.movie_id}`)}
              >
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="uh-watchlist-poster"
                />
                <div className="uh-watchlist-title">{movie.title}</div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Your Reviews">
          <ol className="uh-reviews-list">
            {reviewList.map((review) => (
              <li
                key={review.movie_id}
                className="uh-review-item"
                onClick={() => navigate(`/movie?id=${review.movie_id}`)}
              >
                <div className="uh-review-title">{review.title}</div>
                <div className="uh-review-meta">
                  <span>Rating: {review.rating}</span>
                  <span>
                    Reviewed on:{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="uh-review-text">
                  <strong>Review:</strong> {review.review}
                </div>
                {review.genres && (
                  <div className="uh-review-meta">
                    <span>Genres: {review.genres}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </CollapsibleSection>

        <CollapsibleSection title="Rating Distribution">
          <div className="uh-distribution-container">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDist[star] || 0;
              const total = reviewList.length;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={star} className="uh-rating-bar">
                  <div className="uh-rating-stars">{star} ★</div>
                  <div className="uh-rating-count">
                    <span>{count}</span>
                    <div className="uh-rating-bar-bg">
                      <div
                        className="uh-rating-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Genre Breakdown">
          <div className="uh-genres-grid">
            {Object.entries(genreCounts).map(([genre, count]) => (
              <div key={genre} className="uh-genre-item" onClick={()=>{navigate(`/moviesbygenre?genre=${genre}`)}}>
                <span className="uh-genre-name">{genre}</span>
                <span className="uh-genre-count">{count}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </>
  );
}
