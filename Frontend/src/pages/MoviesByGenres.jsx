import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

export default function MoviesByGenres() {
    const [movies, setMovies] = useState([])
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const genre = searchParams.get("genre");

    useEffect(() => {
        if (!genre) {
            navigate("/");
            return;
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:4500/film/moviesbygenre/${genre}`
                );
                console.log(res.data)
                setMovies(res.data);
            } catch (error) {
                console.error("Error fetching movie details", error);
            }
        };
        fetchData()
    }, [])

    return (<>
        {movies.length != 0 && <>
            <h2>{genre}</h2>
            <ol>
                {movies.map(movie => (
                    <li key={movie.movie_id} onClick={() => { navigate(`/movie?id=${movie.movie_id}`) }}>{`${movie.title} (${movie.release_year}) ${movie.rating} stars`}</li>
                ))}
            </ol>
        </>}
    </>
    )
}
