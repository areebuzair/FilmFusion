// Header component 
// src/components/Header.js
import React from 'react';
import { use } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../provider/authProvider";


function Header() {
  const {token} = useAuth()
  const navigate = useNavigate()
  return (
    <nav>
      <ul>
        <li><Link to="/">Movies</Link></li>
        {token ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={() => { navigate('/logout') }}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
