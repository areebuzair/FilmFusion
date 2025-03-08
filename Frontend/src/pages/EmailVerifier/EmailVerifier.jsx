import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import axios from "axios";
import "./EmailVerifier.css";

export default function EmailVerifier({ login }) {
    const { setToken } = useAuth();
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get("email");;
    const inputsRef = useRef([]);

    const handleLogin = (_token) => {
        setToken(_token);
        navigate("/", { replace: true });
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;

        // limit input to single digit
        if (value.length > 1) {
            return;
        }

        const newVerificationCode = [...verificationCode];
        newVerificationCode[index] = value;

        setVerificationCode(newVerificationCode);

        // Move to the next input box if a digit is entered
        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }

        // Move to the previous input box if backspace is pressed
        if (!value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Convert the array of digits into a single string
        const code = verificationCode.join("");

        // verification logic here
        const formData = { useremail: email, code };

        // try {
        //     const response = await fetch('http://localhost:4500/user/verify', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(formData)
        //     });

        //     if (response.ok) {
        //         const responseData = await response.json();
        //         // setResponseMessage('Signup successful: ' + JSON.stringify(responseData));
        //         console.log(response)
        //         handleLogin(response.data.token)
        //     } else {
        //         // setResponseMessage('Signup failed. Status: ' + response.status);
        //     }
        // } catch (error) {
        //     // setResponseMessage('An error occurred: ' + error.message);
        // }
        console.log("Verification Code Submitted:", code);
        console.log(formData);
        try {
            const response = await axios.post("http://localhost:4500/user/verify", formData);
            console.log("Login successful", response.data.message);
            handleLogin(response.data.token)
        } catch (err) {
            console.log(err)
        }


    };

    if (!email) {
        return <Navigate to="/signup" />
    }

    return (
        <div className="container" id="emailVerifierContainer">
            <form className="email-verifier" onSubmit={handleSubmit}>
                <h1>Enter 6-digit Verification Code</h1>
                <p>A 6-digit code has been sent to {email}</p>
                <div className="input-container">
                    {verificationCode.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleInputChange(e, index)}
                            ref={(el) => (inputsRef.current[index] = el)}
                            className="verification-input"
                            aria-label={`Digit ${index + 1}`}
                        />
                    ))}
                </div>
                <button type="submit" className="button">Verify</button>
            </form>
        </div>
    );
}
