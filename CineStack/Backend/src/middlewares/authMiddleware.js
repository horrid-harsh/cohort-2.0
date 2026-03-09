const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

/**
 * Middleware to protect routes - ensures user is authenticated via cookie
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error(
      "Not authorized, please login to access this resource",
    );
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    const error = new Error("User associated with this token no longer exists");
    error.statusCode = 401;
    throw error;
  }

  if (req.user.isBanned) {
    const error = new Error("Your account has been banned. Contact support.");
    error.statusCode = 403;
    throw error;
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
      const error = new Error(
        `Role (${req.user.role}) is not allowed to access this resource`,
      );
      error.statusCode = 403;
      throw error;
    }
    next();
  };
};

/**
 * Middleware to optionally identify user - doesn't block if not logged in
 * Useful for public routes that have extra features for logged-in users (like history)
 */
const optionalProtect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user && !user.isBanned) {
        req.user = user;
      }
    } catch (error) {
      // Don't throw error, just continue as guest
      console.error("Optional Auth Token Error:", error.message);
    }
  }

  next();
});

module.exports = { protect, authorizeRoles, optionalProtect };
