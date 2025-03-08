import React, { useState } from "react";
import "./SignUp_NGO.css";
import { FaRegUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Register = () => {

  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate()

  const HandleRegSubmit = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setResponseMessage("Passwords do not match")
      return;
    }

    const formData = { username, useremail, password };

    try {
      const response = await fetch('http://localhost:4500/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log(response)

      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage('Signup successful: ' + JSON.stringify(responseData));
        navigate("/verify-registration?email=" + encodeURIComponent(useremail))
      } else {
        setResponseMessage('Signup failed. Status: ' + response.status);
      }
    } catch (error) {
      setResponseMessage('An error occurred: ' + error.message);
    }

    console.log(responseMessage)
  }

  return (
    <div className="signup-wrapper">
      {
        responseMessage
        &&
        <h1>{responseMessage}</h1>
      }
      <form onSubmit={(e) => HandleRegSubmit(e)}>
        <h1>NGO Sign Up</h1>
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
            <button onClick={()=>navigate("/login")} style={{ marginLeft: "5px" }}>
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
