import React from 'react'
import GiveRating from '../components/GiveRating'
import { useAuth } from '../provider/authProvider'
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function MovieDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movieId, setMovieId] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        let id = searchParams.get("id")
        if (!id) {
            navigate("/")
        }
        setMovieId(id)
        console.log({id})
    }, [])
    return (<>
        <div>MovieDetails</div>
        Movie id {movieId}
    </>
    )
}
