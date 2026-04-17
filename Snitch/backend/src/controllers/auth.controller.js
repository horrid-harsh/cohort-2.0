import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/email.service.js";

const isProduction = config.NODE_ENV === "production";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateTokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");
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

  try {
    const decoded = jwt.verify(incomingRefreshToken, config.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select("+refreshToken");

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { user }, "Token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await User.findOne({ 
    $or: [{ email }, { phone }] 
  }).select("+isVerified +lastVerificationSentAt");

  if (existingUser) {
    if (existingUser.email === email && existingUser.isVerified) {
      throw new ApiError(409, "Account already exists with this email.");
    }
    if (existingUser.phone === phone && existingUser.isVerified) {
      throw new ApiError(409, "Account already exists with this phone number.");
    }

    // Cooldown check
    const now = new Date();
    const lastSent = existingUser.lastVerificationSentAt;
    const cooldown = 60 * 1000;

    if (lastSent && now - lastSent < cooldown) {
      throw new ApiError(429, "Please wait before requesting another verification email.");
    }

    const token = existingUser.generateVerificationToken();
    await existingUser.save({ validateBeforeSave: false });
    await sendVerificationEmail(email, name, token);

    return res.status(200).json(new ApiResponse(200, {}, "Verification email sent."));
  }

  const user = new User({ name, email, password, phone, role });
  const token = user.generateVerificationToken();
  await user.save();
  await sendVerificationEmail(email, name, token);

  return res.status(201).json(new ApiResponse(201, {}, "Registration successful. Please verify your email."));
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email }).select("+password +isVerified");
  if (!user) throw new ApiError(400, "Invalid credentials");

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Logged in successfully"));
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// GET /api/v1/auth/verify-email?token=...
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) throw new ApiError(400, "Verification token is required");

  let decoded;
  try {
    decoded = jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new ApiError(400, "Invalid or expired verification token.");
  }

  if (decoded.purpose !== "email-verification") {
    throw new ApiError(400, "Invalid token purpose.");
  }

  const user = await User.findById(decoded?._id).select("+isVerified +verificationToken");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isVerified) {
    return res.status(200).json(new ApiResponse(200, { alreadyVerified: true }, "Email is already verified."));
  }

  if (user.verificationToken !== token) {
    throw new ApiError(400, "Verification link is invalid or has been replaced.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, { verified: true }, "Email verified successfully!"));
});

// POST /api/v1/auth/resend-verification
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email }).select("+isVerified +lastVerificationSentAt");

  if (!user) {
    return res.status(200).json(new ApiResponse(200, {}, "If an account exists, a new verification link was sent."));
  }

  if (user.isVerified) {
    throw new ApiError(400, "Account is already verified.");
  }

  // Cooldown check (60 seconds)
  const now = new Date();
  const lastSent = user.lastVerificationSentAt;
  const cooldown = 60 * 1000;

  if (lastSent && now - lastSent < cooldown) {
    const remainingSeconds = Math.ceil((cooldown - (now - lastSent)) / 1000);
    throw new ApiError(429, `Please wait ${remainingSeconds} seconds before requesting another email.`);
  }

  const token = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });
  await sendVerificationEmail(email, user.name, token);

  return res.status(200).json(new ApiResponse(200, {}, "Verification email resent."));
});

// POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json(new ApiResponse(200, {}, "If account exists, reset link sent."));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail(email, user.name, resetToken);
  return res.status(200).json(new ApiResponse(200, {}, "Reset link sent."));
});

// POST /api/v1/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  }).select("+password"); // Need old hashed password for comparison

  if (!user) throw new ApiError(400, "Invalid or expired token");

  // Check if new password is the same as the old one
  const isSamePassword = await user.isPasswordCorrect(password);
  if (isSamePassword) {
    throw new ApiError(422, "New password cannot be the same as your old password.", {
      password: "New password cannot be the same as your old password."
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password reset successful."));
});

// GET /api/v1/auth/google/callback
export const googleAuth = asyncHandler(async (req, res) => {
  const { googleId, name, email, avatar } = req.user;

  if (!email) {
    throw new ApiError(400, "Google account must have an email associated.");
  }

  let user = await User.findOne({ email });

  if (!user) {
    // 🔹 Create new OAuth user
    user = await User.create({
      name,
      email,
      googleId,
      avatar: { url: avatar },
      authProvider: "google",
      isVerified: true, // Google emails are pre-verified
      phone: "Not Provided", // Temporarily handle mandatory phone for OAuth
    });
  } else {
    // 🔹 Update existing user with OAuth info if not already linked
    let updated = false;
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = user.authProvider === "local" ? "local+google" : user.authProvider;
      updated = true;
    }
    if (!user.avatar?.url) {
      user.avatar = { ...user.avatar, url: avatar };
      updated = true;
    }
    if (!user.isVerified) {
      user.isVerified = true;
      updated = true;
    }

    if (updated) {
      await user.save({ validateBeforeSave: false });
    }
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .redirect(`${config.CLIENT_URL}/`);
});