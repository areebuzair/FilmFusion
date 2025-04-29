import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

export default function ActorProfile() {
    const [actorInfo, setActorInfo] = useState([])
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const actorId = searchParams.get("id");

    useEffect(() => {
        if (!actorId) {
            navigate("/");
            return;
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:4500/film/actor/${actorId}`
                );
                console.log(res.data)
                setActorInfo(res.data);
            } catch (error) {
                console.error("Error fetching movie details", error);
            }
        };
        fetchData()
    }, [])

    return (<>
        {actorInfo.length != 0 && <>
            <h1>{actorInfo[0].first_name} {actorInfo[0].last_name}</h1>
            Born at {new Date(actorInfo[0].dob).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'long',
                timeZone: 'UTC' // or omit/change as needed
            })}
            <h2>Filmography</h2>
            <ol>
                {actorInfo.map(movie => (
                    <li key={movie.movie_id} onClick={() => { navigate(`/movie?id=${movie.id}`) }}>{`${movie.title} (${movie.release_year})`}</li>
                ))}
            </ol>
        </>}
    </>
    )
}
