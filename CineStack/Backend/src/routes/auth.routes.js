const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validation");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

const router = express.Router();

// Specialized Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message:
      "Too many accounts created from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public Routes
router.post(
  "/register",
  registerLimiter,
  registerValidator,
  validate,
  registerUser,
);
router.post("/login", loginLimiter, loginValidator, validate, loginUser);
router.post("/logout", logoutUser);

// Private Routes
router.get("/me", protect, getMe);

module.exports = router;
