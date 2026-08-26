import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Css/ResetPasswordScreen.css";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract token from query params
  const token = new URLSearchParams(location.search).get("resetPasswordToken");

  // ✅ If token missing → show error screen
  if (!token) {
    return (
      <div className="Inclusive-resetPassword-page">
        <div className="error_msg">Invalid or missing reset token.</div>
        <Link to="/forgotpassword" className="link-btn">
          Go Back
        </Link>
      </div>
    );
  }

  // ✅ Reset Password Handler
  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters long");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setError(""), 4000);
      return;
    }

    try {
      setLoading(true);

      // 🔗 Use full backend URL if needed
      const { data } = await axios.put(
        `http://localhost:5000/auth/resetpassword?resetPasswordToken=${token}`,
        { password }
      );

      setSuccess(data.message || "Password reset successful!");
      setError("");
      setLoading(false);

      // 🕒 Redirect after 2.5s
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("❌ Reset password error:", err);
      setLoading(false);

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(errorMsg);
      setSuccess("");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="Inclusive-resetPassword-page">
      <form onSubmit={resetPasswordHandler} className="resetpassword-form">
        <h3>Reset Password</h3>

        {/* ✅ Alerts */}
        {error && <div className="error_msg">{error}</div>}
        {success && (
          <div className="success_msg">
            {success} <Link to="/login">Login</Link>
          </div>
        )}

        {/* ✅ Input: New Password */}
        <div className="input-wrapper">
          <input
            type="password"
            required
            id="password"
            placeholder="Enter new password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">New Password</label>
        </div>

        {/* ✅ Input: Confirm Password */}
        <div className="input-wrapper">
          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Confirm new password"
            autoComplete="off"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="confirmpassword">Confirm Password</label>
        </div>

        {/* ✅ Submit Button */}
        <button className="resetPass-btn" type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordScreen;
