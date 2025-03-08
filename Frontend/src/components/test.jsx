import React from 'react'
import axios from "axios";
import { useEffect } from 'react';
import { use } from 'react';

export default function Test() {

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:4500/film/protected");
            console.log("Message", response.data);
        }
        fetchData()
    }, [])

    return (
        <div>Protected Page</div>
    )
}
