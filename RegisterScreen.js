import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Css/Register.css"

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setError(""), 8000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.post("/auth/register", {
        username,
        email,
        password,
        branch,
      });

      // ✅ Save both token & user details
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/profile"); // ✅ directly go to profile

    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
      setTimeout(() => setError(""), 6000);
    }
  };

  return (
    <div className="Inclusive-register-page">
      <div className="register-big-wrapper">
        <div className="register-banner-section ">
          <img src="register.png" alt="banner" width="490px" />
        </div>

        <div className="section-wrapper">
          <div className="top-suggest_login">
            <span> Have an account? </span>
            <a href="/login">Sign In</a>
          </div>

          <div className="top-register-explain">
            <h2>Welcome to Achievements Hub </h2>
            <p>
              <b>
                It's easy and free to post your Achievements and connect with
                thousands of readers.
              </b>
            </p>
          </div>

          <form onSubmit={registerHandler}>
            {error && <div className="error_message">{error}</div>}

            <div className="input-wrapper">
              <input
                type="text"
                required
                id="name"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="name">Username</label>
            </div>

            <div className="input-wrapper">
              <input
                type="email"
                required
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">E-mail</label>
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                required
                id="password"
                placeholder="6+ strong character"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                required
                id="confirmpassword"
                placeholder="Confirm password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmpassword">Confirm Password</label>
            </div>

            {/* Branch Selection */}
            <div className="input-wrapper">
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
              <label htmlFor="branch">Branch</label>
            </div>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
