import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState } from "react";
import axios from "axios";

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
      handleLogin(response.data.token)
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return <div>
    <h2>Login</h2>
    {error && <p>{error}</p>}
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={useremail}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">
        Login
      </button>
    </form>
  </div>
};


export default Login;
