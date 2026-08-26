import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

const AdminRoutes = () => (
  <Routes>
    {/* ✅ Login route */}
    <Route path="admin/login" element={<AdminLogin />} />

    {/* ✅ Protected route */}
    <Route
      path="admin/dashboard"
      element={
        <PrivateAdminRoute>
          <AdminDashboard />
        </PrivateAdminRoute>
      }
    />

    {/* ✅ Default redirect */}
    <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

    {/* ✅ Catch-all */}
    <Route path="*" element={<h2>404 | Page Not Found</h2>} />
  </Routes>
);

export default AdminRoutes;
