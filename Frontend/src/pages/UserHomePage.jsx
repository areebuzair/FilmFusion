import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserHomePage() {
  const [watchList, setWatchList] = useState([])
  const [reviewList, setReviewList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {


    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(`http://localhost:4500/film/watchlist`);

        console.log(res.data)
        setWatchList(res.data)

      } catch (error) {
        console.error("Error fetching watchlist", error);
      }
    };

    fetchWatchlist();

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:4500/film/movies/myreviews`);

        console.log(res.data)
        setReviewList(res.data)

      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchReviews();
  }, [])

  return (<>
    <div>Home Page</div>
    <ol>Watchlist
      {watchList.map(movie => (
        <li key={movie.movie_id} onClick={()=>{navigate(`/movie?id=${movie.movie_id}`)}}>
          {movie.title}
        </li>
      ))}
    </ol>

    <ol>Reviews
      {reviewList.map(review => (
        <li key={review.movie_id} onClick={()=>{navigate(`/movie?id=${review.movie_id}`)}}>
          {review.title}<br/>
          Rating: {review.rating}<br/>
          {review.review}<br/>
        </li>
      ))}
    </ol>
  </>
  )
}
