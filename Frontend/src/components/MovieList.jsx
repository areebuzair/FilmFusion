// Movie List component 
// src/components/MovieList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MovieList() {
  const [movies, setMovies] = useState([]);
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
              <img src={movie.poster_url} alt={movie.title}/>
              <strong>{movie.title}</strong> ({movie.release_year}) – Directed by {movie.director} – Rating: {movie.rating || 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieList;
