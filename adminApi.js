// Frontend/src/Admin/adminApi.js
import axios from "axios";

// ✅ Base API config
const API = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach admin token automatically for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// 🔐 AUTH
// ======================================================

// ✅ Admin Login
export const adminLogin = async (email, password) => {
  try {
    const { data } = await API.post("/admin/login", { email, password });

    if (data.success && data.token) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", email);
      return { success: true, message: "✅ Login successful!" };
    }
    return { success: false, message: data.message || "❌ Invalid credentials" };
  } catch (error) {
    console.error("Admin login error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check credentials.",
    };
  }
};

// ✅ Check admin dashboard access
export const getAdminDashboard = async () => {
  try {
    const { data } = await API.get("/admin/dashboard");
    return data;
  } catch (error) {
    console.error("Dashboard fetch error:", error.response?.data || error.message);
    return { success: false, message: "❌ Unauthorized or failed to fetch dashboard." };
  }
};

// ✅ Admin Logout
export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminEmail");
  return { success: true, message: "✅ Logged out successfully" };
};

// ✅ Check login status
export const isAdminLoggedIn = () => Boolean(localStorage.getItem("adminToken"));

// ======================================================
// 👥 USERS MANAGEMENT
// ======================================================

export const getAllUsers = async () => {
  try {
    const { data } = await API.get("/admin/users");
    return data;
  } catch (error) {
    console.error("Fetch users error:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch users." };
  }
};

export const updateUser = async (id, updates) => {
  try {
    const { data } = await API.put(`/admin/users/${id}`, updates);
    return data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    return { success: false, message: "Failed to update user." };
  }
};

export const deleteUser = async (id) => {
  try {
    const { data } = await API.delete(`/admin/users/${id}`);
    return data;
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    return { success: false, message: "Failed to delete user." };
  }
};

// ======================================================
// 📝 POSTS MANAGEMENT
// ======================================================

export const getAllPosts = async () => {
  try {
    const { data } = await API.get("/admin/posts");
    return data;
  } catch (error) {
    console.error("Fetch posts error:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch posts." };
  }
};

export const updatePost = async (id, updates) => {
  try {
    const { data } = await API.put(`/admin/posts/${id}`, updates);
    return data;
  } catch (error) {
    console.error("Update post error:", error.response?.data || error.message);
    return { success: false, message: "Failed to update post." };
  }
};

export const deletePost = async (id) => {
  try {
    const { data } = await API.delete(`/admin/posts/${id}`);
    return data;
  } catch (error) {
    console.error("Delete post error:", error.response?.data || error.message);
    return { success: false, message: "Failed to delete post." };
  }
};

// ======================================================
// 💬 COMMENTS MANAGEMENT
// ======================================================

export const getAllComments = async () => {
  try {
    const { data } = await API.get("/admin/comments");
    return data;
  } catch (error) {
    console.error("Fetch comments error:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch comments." };
  }
};

export const updateComment = async (id, updates) => {
  try {
    const { data } = await API.put(`/admin/comments/${id}`, updates);
    return data;
  } catch (error) {
    console.error("Update comment error:", error.response?.data || error.message);
    return { success: false, message: "Failed to update comment." };
  }
};

export const deleteComment = async (id) => {
  try {
    const { data } = await API.delete(`/admin/comments/${id}`);
    return data;
  } catch (error) {
    console.error("Delete comment error:", error.response?.data || error.message);
    return { success: false, message: "Failed to delete comment." };
  }
};

// ======================================================
// Default export
// ======================================================
export default API;
