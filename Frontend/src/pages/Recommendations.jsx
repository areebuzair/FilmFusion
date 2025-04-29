import React, { useState } from 'react';

function Recommendations() {
  const [genreInput, setGenreInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleFetch = () => {
    const genres = genreInput.split(',').map(g => g.trim());

    fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genres }),
    })
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error('Fetch error:', err));
  };

  return (
    <div>
      <h2>Get Movie Recommendations</h2>
      <input
        type="text"
        placeholder="Enter genres like Comedy, Action"
        value={genreInput}
        onChange={(e) => setGenreInput(e.target.value)}
      />
      <button onClick={handleFetch}>Recommend</button>

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
