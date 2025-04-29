import React from "react";
import Header from "./Header";
import MovieList from "./MovieList";
import "./Home.css"; // Import the CSS file

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <MovieList />
    </div>
  );
}
