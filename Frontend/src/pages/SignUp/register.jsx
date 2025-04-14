import React, { useState } from "react";
import "./SignUp_NGO.css";
import { FaRegUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import axios from "axios";

export const Register = () => {
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate()

  const handleLogin = (_token) => {
    setToken(_token);
    navigate("/", { replace: true });
  };

  const HandleRegSubmit = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setResponseMessage("Passwords do not match")
      return;
    }

    const formData = { username, useremail, password };
    console.log(formData)


    try {
      const response = await axios.post("http://localhost:4500/user/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Full response:", response);
      console.log("Registration successful:", response?.data?.message);

      if (response?.data?.token) {
        handleLogin(response.data.token);
      } else {
        console.warn("Token not received in response.");
      }

    } catch (err) {
      console.error("Registration failed:", err?.response?.data || err.message || err);
      console.log(err)
      setResponseMessage(err?.response?.data?.error)
    }

  }

  return (
    <div className="signup-wrapper">
      {
        responseMessage
        &&
        <h1>{responseMessage}</h1>
      }
      <form onSubmit={(e) => HandleRegSubmit(e)}>
        <h1>Sign Up</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required value={username} onInput={(e) => { setUsername(e.target.value) }} />
          <FaRegUser className="icon" />
        </div>
        <div className="input-box email-phone">
          <input type="email" placeholder="Email" required value={useremail} onInput={(e) => { setUseremail(e.target.value) }} />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required value={password} onInput={(e) => { setPassword(e.target.value) }} />
          <FaLock className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Confirm Password" required value={confirmPassword} onInput={(e) => { setConfirmPassword(e.target.value) }} />
          <FaLock className="icon" />
        </div>


        <button type="submit">Sign Up</button>
        <div className="register-link">
          <p>
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} style={{ marginLeft: "5px" }}>
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
