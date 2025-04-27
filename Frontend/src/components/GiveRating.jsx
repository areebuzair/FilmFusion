import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GiveRating({ movie_id }) {
    const [stars, setStars] = useState(0);
    const rows = [];

    const handleUpdate = async (n) => {
        setStars(n);
        console.log(movie_id, n);

        try {
            const response = await axios.post(`http://localhost:4500/film/movies/${movie_id}/rate-review`, {
                rating: n
            });
            console.log('Rating submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    for (let i = 0; i < stars; i++) {
        rows.push(
            <a key={i} onClick={() => { handleUpdate(i + 1); }} style={{ cursor: 'pointer', fontSize: '28px' }}>
                ★
            </a>
        );
    }
    for (let i = stars; i < 5; i++) {
        rows.push(
            <a key={i} onClick={() => { handleUpdate(i + 1); }} style={{ cursor: 'pointer', fontSize: '24px' }}>
                ☆
            </a>
        );
    }

    return (
        <div>
            {rows}
        </div>
    );
}
