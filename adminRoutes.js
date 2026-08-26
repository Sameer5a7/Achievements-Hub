// Backend/Routers/adminRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const User = require("../Models/user");
const Story = require("../Models/story");
const Comment = require("../Models/comment");

const {
  adminLogin,
  getAllUsers,
  deleteUser,
  getAllPosts,
  deletePost,
  getAllComments,
  deleteComment,
  getUserCount,
  getPostCount,
  getCommentCount,
} = require("../Controllers/adminController");

// ✅ Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ✅ Admin Authentication
router.post("/login", adminLogin);

// ✅ User Management
router.get("/users", verifyAdminToken, getAllUsers);
router.delete("/users/:userId", verifyAdminToken, deleteUser);
router.get("/users/count", verifyAdminToken, getUserCount);

// ✅ Post Management
router.get("/posts", verifyAdminToken, getAllPosts);
router.delete("/posts/:postId", verifyAdminToken, deletePost);
router.get("/posts/count", verifyAdminToken, getPostCount);

// ✅ Comment Management
router.get("/comments", verifyAdminToken, getAllComments);
router.delete("/comments/:commentId", verifyAdminToken, deleteComment);
router.get("/comments/count", verifyAdminToken, getCommentCount);

// ✅ Dashboard Summary
router.get("/dashboard", verifyAdminToken, async (req, res) => {
  try {
    const [userCount, postCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Story.countDocuments(),
      Comment.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      admin: req.admin,
      dashboard: {
        totalUsers: userCount,
        totalPosts: postCount,
        totalComments: commentCount,
      },
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard" });
  }
});

module.exports = router;
