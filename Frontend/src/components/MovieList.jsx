// Movie List component 
// src/components/MovieList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/authProvider';
import GiveRating from './GiveRating';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const {token} = useAuth()
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:4500/film/movies');
        setMovies(res.data);
      } catch (error) {
        console.error('Error fetching movies', error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h2>Movies List</h2>
      {movies.length === 0 ? (
        <p>No movies available.</p>
      ) : (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              <img src={movie.poster_url} alt={movie.title}/><br/>
              <strong>{movie.title}</strong> ({movie.release_year}) <br/>
              Directed by {movie.director} <br/>
              Rating: {movie.rating || 'N/A'} <br/>
              {token && <GiveRating movie_id={movie.id}/>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieList;
