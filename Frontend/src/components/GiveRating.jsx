import React from 'react'
import { useState } from 'react'

export default function GiveRating({movie_id}) {
    const [stars, setStars] = useState(0);
    const rows = [];
    const handleUpdate =(n)=>{
        setStars(n)
        console.log(movie_id, n)
    }
    for (let i = 0; i < stars; i++) {
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        rows.push(<a key={i} onClick={()=>{handleUpdate(i+1)}}>★</a>);
    }
    for (let i = stars; i < 5; i++) {
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        rows.push(<a key={i} onClick={()=>{handleUpdate(i+1)}}>☆</a>);
    }
    return (
        rows
    )
}
