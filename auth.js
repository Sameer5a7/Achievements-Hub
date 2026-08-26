const asyncErrorWrapper = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/user");
const CustomError = require("../Helpers/error/CustomError");
const { sendToken } = require("../Helpers/auth/tokenHelpers");
const sendEmail = require("../Helpers/Libraries/sendEmail");
const { validateUserInput } = require("../Helpers/input/inputHelpers");

//
// ========================
// 🔒 PRIVATE DATA ROUTE
// ========================
const getPrivateData = asyncErrorWrapper((req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Access granted to private data",
    user: req.user,
  });
});

//
// ========================
// 🧑 REGISTER USER
// ========================
const register = asyncErrorWrapper(async (req, res, next) => {
  const { username, email, password, branch } = req.body;

  if (!username || !email || !password || !branch) {
    return next(new CustomError("Please fill in all required fields", 400));
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new CustomError("Email is already registered", 400));
  }

  // ✅ Let pre-save hook hash password automatically
  const newUser = await User.create({
    username,
    email: email.toLowerCase(),
    password,
    branch,
  });

  console.log("✅ User registered successfully:", newUser.email);
  sendToken(newUser, 201, res);
});

//
// ========================
// 🔐 LOGIN USER
// ========================
const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please provide both email and password", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    console.log("❌ No user found with that email:", email);
    return next(new CustomError("Invalid email or password", 401));
  }

  console.log("✅ User found in DB:", user.email);
  console.log("🔑 Entered Password:", password);
  console.log("🔒 Stored Hash:", user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Password mismatch for:", user.email);
    return next(new CustomError("Invalid email or password", 401));
  }

  console.log("✅ Password matched successfully:", user.email);
  sendToken(user, 200, res);
});

//
// ========================
// 📧 FORGOT PASSWORD
// ========================
const forgotpassword = asyncErrorWrapper(async (req, res, next) => {
  const { URI, EMAIL_USERNAME } = process.env;
  const resetEmail = req.body.email;

  if (!resetEmail) {
    return next(new CustomError("Please provide an email address", 400));
  }

  const user = await User.findOne({ email: resetEmail.toLowerCase() });
  if (!user) {
    return next(new CustomError("There is no user with that email", 404));
  }

  // ✅ Generate reset token (raw + hashed)
  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save({ validateBeforeSave: false });

  // ✅ Use the RAW token (not hashed) in the URL
  const resetPasswordUrl = `${URI}/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  console.log("🧩 Raw Reset Token (for email link):", resetPasswordToken);
  console.log("🧠 Hashed Token saved in DB:", user.resetPasswordToken);

  const emailTemplate = `
    <h3 style="color:red">Reset Your Password</h3>
    <p>
      Click this <a href="${resetPasswordUrl}" target="_blank">link</a> to reset your password.
      <br/><br/>⚠️ This link will expire in 1 hour.
    </p>
  `;

  try {
    await sendEmail({
      from: EMAIL_USERNAME,
      to: resetEmail,
      subject: "✔ Reset Your Password ✔",
      html: emailTemplate,
    });

    console.log("📧 Reset password email sent to:", resetEmail);
    return res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("❌ Email sending failed:", error);
    return next(new CustomError("Email could not be sent", 500));
  }
});

//
// ========================
// 🔁 RESET PASSWORD
// ========================
const resetpassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid reset token", 400));
  }

  if (!password) {
    return next(new CustomError("Please provide a new password", 400));
  }

  // ✅ Hash the token for DB lookup
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken.trim()) // trim spaces if any
    .digest("hex");

  console.log("🔍 Raw Token from URL:", resetPasswordToken);
  console.log("🔒 Hashed Token for DB lookup:", hashedToken);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    console.log("❌ No matching user found for reset token");
    return next(new CustomError("Invalid or expired password reset token", 401));
  }

  // ✅ Let pre-save hook hash password automatically
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  console.log("🔄 Password reset successfully for:", user.email);

  return res.status(200).json({
    success: true,
    message: "Password reset successful. You can now log in with your new password.",
  });
});

//
// ========================
// EXPORTS
// ========================
module.exports = {
  register,
  login,
  forgotpassword,
  resetpassword,
  getPrivateData,
};
