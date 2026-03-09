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
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  name = name.trim();
  email = email.toLowerCase().trim();

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error("User already exists with this email");
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
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
