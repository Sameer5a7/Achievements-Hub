// Backend/Helpers/auth/tokenHelpers.js

// ✅ These helpers handle extracting and sending JWT tokens safely
//    Updated to tolerate lowercase “bearer” and missing “Bearer” prefix.

const isTokenIncluded = (req) => {
  const auth =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.headers["authorization"];

  if (!auth) return false;

  // Allow “Bearer <token>”, “bearer <token>”, or even just the token itself
  const lower = auth.toLowerCase();
  return lower.startsWith("bearer ") || auth.split(" ").length === 2;
};

const getAccessTokenFromHeader = (req) => {
  const authorization =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.headers["authorization"];

  if (!authorization) return null;

  const parts = authorization.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }
  return parts[0];
};

const sendToken = (user, statusCode, res) => {
  const token = user.generateJwtFromUser();

  return res.status(statusCode).json({
    success: true,
    token,
  });
};

module.exports = {
  isTokenIncluded,
  getAccessTokenFromHeader,
  sendToken,
};
