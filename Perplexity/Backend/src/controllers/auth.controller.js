import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/api/auth/verify-email?token=${emailVerificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your email – Perplexity Clone",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>Welcome, ${username}!</h2>
          <p>Thanks for signing up. Please verify your email to get started.</p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;margin-top:12px;">
            Verify Email
          </a>
          <p style="margin-top:24px;color:#888;font-size:12px;">Link expires in 24 hours. If you didn't sign up, ignore this email.</p>
        </div>
      `,
    });
  } catch (emailError) {
    await userModel.findByIdAndDelete(user._id);
    throw new ApiError(500, "Failed to send verification email. Please try again.");
  }

  return ApiResponse.success(res, 201, "Registration successful. Please check your email to verify your account.", {
    id: user._id,
    username: user.username,
    email: user.email,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Email not verified. Please check your inbox.");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);

  return ApiResponse.success(res, 200, "Login successful", {
    id: user._id,
    email: user.email,
    username: user.username,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decodedToken.email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  user.isVerified = true;
  await user.save();

  return ApiResponse.success(res, 200, "Email verified successfully. You can now log in.");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  return ApiResponse.success(res, 200, "User fetched successfully", {
    id: user._id,
    email: user.email,
    username: user.username,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  return ApiResponse.success(res, 200, "Logged out successfully");
});
