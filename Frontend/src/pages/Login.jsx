// src/components/Login.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the CSS for styling
import Header from "../components/Header";

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [useremail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (_token) => {
    setToken(_token);
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:4500/user/login", {
        useremail,
        password,
      });
      console.log("Login successful", response.data.message);
      handleLogin(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={useremail}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
