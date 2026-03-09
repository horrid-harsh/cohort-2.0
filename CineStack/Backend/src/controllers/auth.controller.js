const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const sendToken = require("../utils/sendToken");

/**
 * @desc Register a User
 * @route POST /api/v1/auth/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, email and password are required");
    error.statusCode = 400;
    throw error;
  }

  name = name.trim();
  email = email.toLowerCase().trim();

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User already exists with this email");
    error.statusCode = 409;
    throw error;
  }

  // Create a new user (Hashing is handled by the model's pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
  });

  // Send JWT token via HTTP-only cookie
  sendToken(user, 201, res, "User registered successfully");
});

/**
 * @desc Login a User
 * @route POST /api/v1/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Please provide email and password");
    error.statusCode = 400;
    throw error;
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  sendToken(user, 200, res, "Logged in successfully");
});

/**
 * @desc Logout User / Clear Cookie
 * @route GET /api/v1/auth/logout
 * @access Private
 */
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0), // set to past date = forces browser to delete it
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * @desc Get Current User Profile
 * @route GET /api/v1/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
