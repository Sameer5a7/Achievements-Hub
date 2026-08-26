const asyncErrorWrapper = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const Story = require("../Models/story");
const Comment = require("../Models/comment");
const CustomError = require("../Helpers/error/CustomError");
require("dotenv").config();

/* ======================================================
   🔐 ADMIN LOGIN
====================================================== */
const adminLogin = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

  if (!email || !password) {
    return next(new CustomError("Please provide both email and password", 400));
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return next(new CustomError("Invalid admin credentials", 401));
  }

  const token = jwt.sign({ email, role: "admin" }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE || "1d",
  });

  return res.status(200).json({
    success: true,
    message: "Admin login successful",
    token,
  });
});

/* ======================================================
   👥 USER MANAGEMENT
====================================================== */
const getAllUsers = asyncErrorWrapper(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    success: true,
    users,
  });
});

const getUserCount = asyncErrorWrapper(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json({
    success: true,
    count,
  });
});

const updateUser = asyncErrorWrapper(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select("-password");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

const deleteUser = asyncErrorWrapper(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

/* ======================================================
   📝 POST MANAGEMENT
====================================================== */
const getAllPosts = asyncErrorWrapper(async (req, res) => {
  const posts = await Story.find().populate("author", "username email branch");
  res.status(200).json({
    success: true,
    posts,
  });
});

const getPostCount = asyncErrorWrapper(async (req, res) => {
  const count = await Story.countDocuments();
  res.status(200).json({
    success: true,
    count,
  });
});

const updatePost = asyncErrorWrapper(async (req, res) => {
  const { postId } = req.params;
  const updates = req.body;

  const updatedPost = await Story.findByIdAndUpdate(postId, updates, {
    new: true,
  });

  if (!updatedPost) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post: updatedPost,
  });
});

const deletePost = asyncErrorWrapper(async (req, res) => {
  const { postId } = req.params;
  const post = await Story.findByIdAndDelete(postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

/* ======================================================
   💬 COMMENT MANAGEMENT
====================================================== */
const getAllComments = asyncErrorWrapper(async (req, res) => {
  const comments = await Comment.find()
    .populate("user", "username email")
    .populate("story", "title");

  res.status(200).json({
    success: true,
    comments,
  });
});

const getCommentCount = asyncErrorWrapper(async (req, res) => {
  const count = await Comment.countDocuments();
  res.status(200).json({
    success: true,
    count,
  });
});

const updateComment = asyncErrorWrapper(async (req, res) => {
  const { commentId } = req.params;
  const updates = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, {
    new: true,
  });

  if (!updatedComment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    comment: updatedComment,
  });
});

const deleteComment = asyncErrorWrapper(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

/* ======================================================
   📊 EXPORT CONTROLLERS
====================================================== */
module.exports = {
  adminLogin,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllPosts,
  updatePost,
  deletePost,
  getAllComments,
  updateComment,
  deleteComment,
  getUserCount,
  getPostCount,
  getCommentCount,
};
