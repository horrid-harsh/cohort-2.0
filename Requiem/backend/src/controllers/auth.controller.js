import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isProduction = process.env.NODE_ENV === "production";

// Cookie options — httpOnly prevents JS access (XSS protection)
const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // false for local http, true for production https
  sameSite: isProduction ? "none" : "lax", // "none" in production for extension support, "lax" for local dev
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// For chrome extension development on localhost, it sometimes needs SameSite: None 
// BUT SameSite: None mandatory requires Secure: True.
// If the developer is on HTTP, they should use SameSite: Lax.
// To support the extension in local dev, the extension must handle cookie retrieval manually OR use HTTPS.


const generateTokens = async (userId) => {
  const user = await UserModel.findById(userId).select("+refreshToken");
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// POST /api/v1/auth/refresh
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
 
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized — no refresh token");
  }
 
  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
 
  const user = await UserModel.findById(decoded?._id).select("+refreshToken");
  if (!user) throw new ApiError(401, "Invalid refresh token");
 
  // Check token matches what's stored in DB
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token expired or already used");
  }
 
  // Generate fresh tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);
 
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user }, "Token refreshed successfully"));
});

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

  const loggedInUser = await UserModel.findById(user._id).select("name email avatar");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Logged in successfully"));
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
  const user = await UserModel.findById(req.user._id).select("name email avatar");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});