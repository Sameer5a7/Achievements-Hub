import { useState, useContext } from "react";
import axios from "axios";
import "../../Css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const LoginScreen = () => {
  const { setAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const url = isAdmin
        ? "http://localhost:5000/admin/login"
        : "http://localhost:5000/auth/login";

      const { data } = await axios.post(url, { email, password });

      // Save token
      localStorage.setItem("authToken", data.token);

      // Save admin info if admin
      if (isAdmin) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setAdmin(data.admin);
      } else {
        localStorage.setItem("user", JSON.stringify(data.user || {}));
      }

      // Redirect
      // ✅ Redirect Admins to dashboard
navigate(isAdmin ? "/admin/dashboard" : "/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Check backend connection."
      );
      setTimeout(() => setError(""), 4500);
    }
  };

  return (
    <div className="Inclusive-login-page">
      <div className="login-big-wrapper">
        <div className="section-wrapper">
          <div className="top-suggest_register">
            <span>Don't have an account? </span>
            <Link to="/register">Sign Up</Link>
          </div>

          <div className="top-login-explain">
            <h2>Login to Your Account</h2>
            <p>Please Login Your Account, Thank You!</p>
          </div>

          {/* Toggle User/Admin */}
          <div className="login-toggle">
            <button
              type="button"
              className={!isAdmin ? "active" : ""}
              onClick={() => setIsAdmin(false)}
            >
              User
            </button>
            <button
              type="button"
              className={isAdmin ? "active" : ""}
              onClick={() => setIsAdmin(true)}
            >
              Admin
            </button>
          </div>

          <form onSubmit={loginHandler}>
            {error && <div className="error_message">{error}</div>}

            <div className="input-wrapper">
              <input
                type="email"
                required
                id="email"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <label htmlFor="email">E-mail</label>
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                required
                id="password"
                placeholder="6+ strong characters"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <label htmlFor="password">Password</label>
            </div>

            {!isAdmin && (
              <Link to="/forgotpassword" className="login-screen__forgotpassword">
                Forgot Password?
              </Link>
            )}

            <button type="submit">{isAdmin ? "Admin Login" : "Login"}</button>
          </form>
        </div>

        <div className="login-banner-section">
          <img src="login.png" alt="banner" width="400px" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
