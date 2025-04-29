// src/components/Register.jsx

import React, { useState } from "react";
import "./SignUp_NGO.css"; // New Signup.css
import { FaRegUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import axios from "axios";
import Header from "../components/Header";

export const Register = () => {
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = (_token) => {
    setToken(_token);
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setResponseMessage("Passwords do not match");
      return;
    }

    const formData = { username, useremail, password };

    try {
      const response = await axios.post(
        "http://localhost:4500/user/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.token) {
        handleLogin(response.data.token);
      } else {
        console.warn("Token not received in response.");
      }
    } catch (err) {
      setResponseMessage(err?.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          {responseMessage && (
            <div className="error-message">{responseMessage}</div>
          )}

          <div className="input-group">
            <FaRegUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={useremail}
              onChange={(e) => setUseremail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="auth-link">
              Login
            </span>
          </p>
        </form>
      </div>
    </>
  );
};
