// Add Genre component 
// src/components/AddGenre.js
import React, { useState } from 'react';
import axios from 'axios';

function AddGenre() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4500/film/genres', {
        name
      });
      setMessage('Genre added successfully!');
      setName('');
    } catch (error) {
      console.error(error);
      setMessage('Error adding genre.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Genre Name:</label>
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} required />
        </div>
        <button type="submit">Add Genre</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddGenre;
