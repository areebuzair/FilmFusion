import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Recommendations() {
  const [genreInput, setGenreInput] = useState('');
  const [genresOptions, setGenresOptions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const handleFetch = () => {
    const genres = selectedGenres;

    fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genres }),
    })
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('http://localhost:4500/film/genres');
        setGenresOptions(res.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div>
      <h2>Get Movie Recommendations</h2>
      {/* <input
        type="text"
        placeholder="Enter genres like Comedy, Action"
        value={genreInput}
        onChange={(e) => setGenreInput(e.target.value)}
      /> */}

      {genresOptions.map((genre) => (
        <div key={genre.id}>
          <label>
            <input
              type="checkbox"
              value={genre.id}
              checked={selectedGenres.includes(genre.name)}
              onChange={(e) => {
                if (e.target.checked) {
                  // Add the genre ID if checked
                  setSelectedGenres([...selectedGenres, genre.name]);
                } else {
                  // Remove the genre ID if unchecked
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

      {selectedGenres.join(", ")}<br/>
      {selectedGenres.length>0 && <button onClick={handleFetch}>Recommend</button>}

      <ul>
        {recommendations.map((movie, index) => (
          <li key={index}>
            <strong>{movie.title}</strong> ({movie.genres}) - Rating: {movie.rating.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;
