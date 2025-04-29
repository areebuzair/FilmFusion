// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import "./Header.css"; // import the CSS file

function Header() {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">MovieApp</Link>
        </div>
        <nav className="nav-links">
          <ul>
            <li>
              <Link to="/">Movies</Link>
            </li>
            {token ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/user">Profile</Link>
                </li>
                <li>
                  <button
                    className="logout-button"
                    onClick={() => navigate("/logout")}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
