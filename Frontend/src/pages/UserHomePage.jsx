import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        const res = await axios.get(`http://localhost:4500/film/movies/myreviews`);
        const reviews = res.data;
        setReviewList(reviews);

        // Average Rating
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          setAvgRating((totalRating / reviews.length).toFixed(2));
        }

        // Genre Counts
        const genreMap = {};
        reviews.forEach(r => {
          const genres = r.genres ? r.genres.split(',') : [];
          genres.forEach(g => {
            const trimmed = g.trim();
            genreMap[trimmed] = (genreMap[trimmed] || 0) + 1;
          });
        });
        setGenreCounts(genreMap);

        // Rating Distribution
        const ratingMap = {};
        reviews.forEach(r => {
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
    (max, curr) => curr[1] > max[1] ? curr : max,
    ["None", 0]
  )[0];

  return (
    <>
      <h2>User Home Page</h2>

      <div>
        <strong>Number of Reviews Written:</strong> {reviewList.length}<br />
        <strong>Total Movies in Watchlist:</strong> {watchList.length}<br />
        <strong>Average Rating Given:</strong> {avgRating}<br />
        <strong>Most Watched Genre:</strong> {mostWatchedGenre}<br />
      </div>

      <h3>Watchlist</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {watchList.map(movie => (
          <div
            key={movie.movie_id}
            onClick={() => navigate(`/movie?id=${movie.movie_id}`)}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              style={{ width: '100px', height: '150px', objectFit: 'cover' }}
            />
            <div>{movie.title}</div>
          </div>
        ))}
      </div>

      <h3>Reviews</h3>
      <ol>
        {reviewList.map(review => (
          <li
            key={review.movie_id}
            onClick={() => navigate(`/movie?id=${review.movie_id}`)}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
          >
            <strong>{review.title}</strong><br />
            Rating: {review.rating}<br />
            Review: {review.review}<br />
            Genres: {review.genres}<br />
            Reviewed on: {new Date(review.created_at).toLocaleDateString()}<br />
          </li>
        ))}
      </ol>

      <h3>Rating Distribution</h3>
      <ul>
        {[5, 4, 3, 2, 1].map(star => (
          <li key={star}>
            {star} Star: {ratingDist[star] || 0}
          </li>
        ))}
      </ul>

      <h3>Genre Counts</h3>
      <ul>
        {Object.entries(genreCounts).map(([genre, count]) => (
          <li key={genre}>
            {genre}: {count}
          </li>
        ))}
      </ul>
    </>
  );
}
