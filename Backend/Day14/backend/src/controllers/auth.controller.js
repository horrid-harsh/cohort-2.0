const userModel = require("../models/user.model");
// const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Handles user registration
 * @route POST /api/auth/register
 * @access Public
 */
async function registerController(req, res) {
  const { username, email, password, bio, profileImage } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(409).json({
      message:
        "User already exists with this " +
        (existingUser.email === email ? "email" : "username"),
    });
  }

  //   const hash = crypto.createHash('sha256').update(password).digest('hex');
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
    profileImage,
    bio,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
}

/**
 * Handles user login
 * @route POST /api/auth/login
 * @access Public
 */
async function loginController(req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const user = await userModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // const hash = crypto.createHash('sha256').update(password).digest('hex');
  // const ispasswordValid = hash === user.password;
  const ispasswordValid = await bcrypt.compare(password, user.password);

  if (!ispasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User login succesful",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

/**
 * Handles user profile fetch
 * @route GET /api/auth/me
 * @access Private
 */
async function getMeController(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId);

  return res.status(200).json({
    message: "User fetched successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
    registerController, loginController, getMeController
}