import React from 'react'
import GiveRating from '../components/GiveRating'
import { useAuth } from '../provider/authProvider'
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function MovieDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movie, setMovie] = useState()
    const { token } = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        let id = searchParams.get("id")
        if (!id) {
            navigate("/")
        }


        const fetchMovies = async () => {
            try {
                const res = await axios.get(`http://localhost:4500/film/movies/${id}`);
                setMovie(res.data);
                console.log(res.data)
            } catch (error) {
                console.error("Error fetching movies", error);
            }
        };
        fetchMovies();

    }, [])
    return (<>
        {movie &&
            <div>MovieDetails
                <img
                    src={movie.movie.poster_url}
                    alt={movie.movie.title}
                    className="movie-poster"
                />
                <div className="movie-info">
                    <h3>
                        {movie.movie.title} ({movie.movie.release_year})
                    </h3>
                    <p>
                        <strong>Director:</strong> {movie.movie.director}
                    </p>

                    {/* Rating Section */}
                    <div className="movie-rating">
                        <span className="star">⭐</span>
                        <span>{movie.movie.rating || "N/A"}</span>
                    </div>
                </div>
                <h3>Actors</h3>
                <ol>
                    {movie.actors.map((actor) => (
                        <li key={actor.id}>{actor.first_name + ' ' + actor.last_name}</li>
                    ))}
                </ol>
                <h3>Genres</h3>
                <ol>
                    {movie.genres.map((genre) => (
                        <li key={genre}>{genre}</li>
                    ))}
                </ol>
                <h3>Reviews</h3>
                {token && <GiveRating movie_id={movie.movie.id} />}
                <ol>
                    {movie.reviews.map((review) => (
                        <li key={review.id}>
                            User Id: {review.user_id} <br/>
                            Rating: {review.rating} <br/>
                            Review: {review.review} <br/>
                        </li>
                    ))}
                </ol>
            </div>
        }
    </>
    )
}
