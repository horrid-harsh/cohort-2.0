import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cookie options — httpOnly prevents JS access (XSS protection)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : true, // `true` is required for `sameSite: "none"`
  sameSite: "none", // `none` is required for cross-origin (like a Chrome extension)
};

const generateTokens = async (userId) => {
  const user = await UserModel.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already exists");

  const user = await UserModel.create({ name, email, password });

  const createdUser = await UserModel.findById(user._id);
  if (!createdUser) throw new ApiError(500, "User registration failed");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Registered successfully"));
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "Email and password required");

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new ApiError(400, "Invalid credentials");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await UserModel.findById(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Logged in successfully"));
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});