import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post("http://localhost:5000/admin/login", {
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin || { email, role: "admin" })
        );
        setAdmin(data.admin || { email, role: "admin" });

        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/admin/dashboard"), 800);
      } else {
        setMessage(`❌ ${data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Admin login error:", error.response?.data || error.message);
      setMessage("❌ Login failed. Check credentials or server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
