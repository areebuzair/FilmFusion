// src/components/AddMovie.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddMovie() {
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [director, setDirector] = useState('');
  const [rating, setRating] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [genresOptions, setGenresOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);

  // Fetch available genres from the backend when the component mounts
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let photoURL;

    if (photo) {
      const formData = new FormData();
      formData.append('image', photo);
      console.log(photo)

      try {
        const response = await axios.post('http://localhost:4500/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoURL = response.data.url;
      } catch (error) {
        console.error('Error uploading the image:', error);
        alert("Error uploading the image");
        return;
      }
    }

    try {
      // Map selected genre IDs to genre names if your API expects names.
      // Alternatively, you could send the IDs and adjust your API to work with them.
      const selectedGenres = genresOptions
        .filter((genre) => selectedGenreIds.includes(genre.id))
        .map((genre) => genre.name);

      console.log(selectedGenres)

      await axios.post(
        'http://localhost:4500/film/movies',
        {
          title,
          release_year: parseInt(releaseYear),
          director,
          rating: null,
          genres: selectedGenres,
          poster_url: photoURL
        }
      );
      setMessage('Movie added successfully!');
      // Reset fields
      setTitle('');
      setReleaseYear('');
      setDirector('');
      setRating('');
      setSelectedGenreIds([]);
    } catch (error) {
      console.error(error);
      setMessage('Error adding movie.');
    }
  };

  return (
    <div>
      <h3>Add Movie</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Release Year:</label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Director:</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            required
          />
        </div>
        {/* <div>
          <label>Rating:</label>
          <input
            type="number"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div> */}
        <div>
          <label>Poster:</label>
          <input
            type="file"
            name="licenseImage"
            onChange={e => setPhoto(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label>Select Genres:</label>
          {genresOptions.map((genre) => (
            <div key={genre.id}>
              <label>
                <input
                  type="checkbox"
                  value={genre.id}
                  checked={selectedGenreIds.includes(genre.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Add the genre ID if checked
                      setSelectedGenreIds([...selectedGenreIds, genre.id]);
                    } else {
                      // Remove the genre ID if unchecked
                      setSelectedGenreIds(
                        selectedGenreIds.filter((id) => id !== genre.id)
                      );
                    }
                  }}
                />
                {genre.name}
              </label>
            </div>
          ))}
          {selectedGenreIds.map((item) => (
            <div>{item}</div>
          ))}
        </div>
        <button type="submit">Add Movie</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddMovie;
