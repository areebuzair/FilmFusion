import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ActorProfile.css";
import Header from "../components/Header";

export default function ActorProfile() {
  const [actorInfo, setActorInfo] = useState([]);
  const [isFilmographyExpanded, setIsFilmographyExpanded] = useState(true);
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
        setActorInfo(res.data);
      } catch (error) {
        console.error("Error fetching actor details", error);
      }
    };
    fetchData();
  }, [actorId, navigate]);

  const toggleFilmography = () => {
    setIsFilmographyExpanded(!isFilmographyExpanded);
  };

  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      <div className="actor-profile-container">
        {actorInfo.length !== 0 && (
          <>
            <div className="actor-header">
              <h1 className="actor-name">
                {actorInfo[0].first_name} {actorInfo[0].last_name}
              </h1>
            </div>
            <p className="actor-dob">
              Born on{" "}
              {new Date(actorInfo[0].dob).toLocaleString("en-US", {
                dateStyle: "long",
                timeZone: "UTC",
              })}
            </p>

            <div className="filmography-section">
              <div
                className={`filmography-header ${
                  !isFilmographyExpanded ? "collapsed" : ""
                }`}
                onClick={toggleFilmography}
              >
                <h2 className="filmography-title">Filmography</h2>
                <span className="toggle-icon">▼</span>
              </div>
              <ul
                className={`filmography-list ${
                  isFilmographyExpanded ? "expanded" : ""
                }`}
              >
                {actorInfo.map((movie) => (
                  <li
                    key={movie.movie_id}
                    className="filmography-item"
                    onClick={() => navigate(`/movie?id=${movie.id}`)}
                  >
                    {`${movie.title} (${movie.release_year})`}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}
