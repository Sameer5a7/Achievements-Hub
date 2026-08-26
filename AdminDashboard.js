// ✅ Frontend/src/Admin/AdminDashboard.js
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUsers, FaBook, FaComments, FaHome, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ===== Left Sidebar ===== */}
      <div
        style={{
          width: "220px",
          background: "#0b5ea8",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "30px", textAlign: "center" }}>
          Admin Panel
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/admin/dashboard" style={linkStyle}>
            <FaHome style={iconStyle} /> Dashboard
          </Link>
          <Link to="/admin/dashboard/users" style={linkStyle}>
            <FaUsers style={iconStyle} /> Users
          </Link>
          <Link to="/admin/dashboard/posts" style={linkStyle}>
            <FaBook style={iconStyle} /> Posts
          </Link>
          <Link to="/admin/dashboard/comments" style={linkStyle}>
            <FaComments style={iconStyle} /> Comments
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            background: "#e11d48",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* ===== Right Content ===== */}
      <div
        style={{
          flex: 1,
          padding: "40px 60px", // ✅ adds spacing
          background: "#f9fafb",
          overflowY: "auto",
        }}
      >
        <Outlet /> {/* child components (ManageUsers, etc.) */}
      </div>
    </div>
  );
};

// Styles
const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#0d6efd",
};

const iconStyle = { fontSize: "16px" };

export default AdminDashboard;
