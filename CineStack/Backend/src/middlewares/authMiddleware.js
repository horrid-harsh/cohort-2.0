const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

/**
 * Middleware to protect routes - ensures user is authenticated via cookie
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login to access this resource");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    res.status(401);
    throw new Error("User associated with this token no longer exists");
  }

  if (req.user.isBanned) {
    res.status(403);
    throw new Error("Your account has been banned. Contact support.");
  }

  next();
});

/**
 * Middleware to restrict access based on user roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role (${req.user.role}) is not allowed to access this resource`,
      );
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
