import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LinkActorWithMovie() {
    const [movies, setMovies] = useState([])
    const [actors, setActors] = useState([])
    const [message, setMessage] = useState('');
    const [selectedMovie, setSelectedMovie] = useState()
    const [selectedActor, setSelectedActor] = useState()

    useEffect(() => {
        const getActors = async () => {
            try {
                const res = await axios.get('http://localhost:4500/film/actors');
                console.log(res.data)
                setActors(res.data)
            }
            catch (err) {
                console.log("Could not fetch actors", err)
            }
        }

        const getMovies = async () => {
            try {
                const res = await axios.get('http://localhost:4500/film/movies');
                console.log(res.data)
                setMovies(res.data)
            }
            catch (err) {
                console.log("Could not fetch movies", err)
            }
        }

        getActors();
        getMovies();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:4500/film/movies/${selectedMovie}/actors/${selectedActor}`
            );

            console.log('Successfully added movie to actor:', response.data);
            setMessage('Successfully added movie to actor!');
            // Handle success in your UI
        } catch (error) {
            if (error.response) {
                console.error('API error:', error.response.data.message);
                setMessage(error.response.data.message);
            } else {
                console.error('Network error:', error.message);
                setMessage(error.message);

            }
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Actor</label>
                    <select onChange={(e) => { setSelectedActor(e.target.value) }}>
                        {actors.map(actor => (
                            <option value={actor.id}>{`${actor.first_name} ${actor.last_name}`}</option>
                        ))}
                    </select>
                    <label>Movie</label>
                    <select onChange={(e) => { setSelectedMovie(e.target.value) }}>
                        {movies.map(movie => (
                            <option value={movie.id}>{`${movie.title} (${movie.release_year})`}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Add Movie to Actor</button>
                {selectedActor} {selectedMovie}
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}
