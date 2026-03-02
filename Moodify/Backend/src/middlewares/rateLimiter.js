const rateLimit = require("express-rate-limit");

// Strict limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many attempts. Try again later.",
});

// Relaxed refresh limiter
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many refresh requests. Slow down.",
});

// Register limiter
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many accounts created.",
});

module.exports = {
  authLimiter,
  refreshLimiter,
  registerLimiter,
};