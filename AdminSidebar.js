import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  // 🔐 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside
      style={{
        width: 240,
        backgroundColor: "#0b62a4",
        color: "#fff",
        minHeight: "100vh",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Sidebar header */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 28,
            textAlign: "center",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
            paddingBottom: 10,
          }}
        >
          Admin Panel
        </h2>

        {/* ✅ Navigation Links (relative paths fixed) */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <NavLink to="." end style={linkStyle}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="users" style={linkStyle}>
            👥 Users
          </NavLink>
          <NavLink to="posts" style={linkStyle}>
            📰 Posts
          </NavLink>
          <NavLink to="comments" style={linkStyle}>
            💬 Comments
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#d9534f",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 14px",
          fontSize: 15,
          cursor: "pointer",
          marginTop: 30,
          width: "100%",
          textAlign: "center",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#c9302c")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#d9534f")}
      >
        🚪 Logout
      </button>
    </aside>
  );
};

// ✅ Style function for NavLink (active/inactive)
const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 14px",
  borderRadius: 6,
  textDecoration: "none",
  color: "#fff",
  backgroundColor: isActive ? "#094b7d" : "transparent",
  fontWeight: isActive ? "bold" : "normal",
  transition: "all 0.2s ease",
});

export default AdminSidebar;
