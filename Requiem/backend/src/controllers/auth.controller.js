import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendVerificationEmail } from "../services/email.service.js";

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
      process.env.REFRESH_TOKEN_SECRET,
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

  // 1. Check if user already exists
  const existingUser = await UserModel.findOne({ email }).select(
    "+isVerified +lastVerificationSentAt",
  );

  if (existingUser) {
    // Case A: User is already verified → Conflict
    if (existingUser.isVerified) {
      throw new ApiError(
        409,
        "An account with this email already exists~`              .",
      );
    }

    // Case B: User exists but is NOT verified → Potentially resend
    const now = new Date();
    const lastSent = existingUser.lastVerificationSentAt;
    const cooldownPeriod = 60 * 1000; // 60 seconds

    if (lastSent && now - lastSent < cooldownPeriod) {
      const remainingTime = Math.ceil(
        (cooldownPeriod - (now - lastSent)) / 1000,
      );
      throw new ApiError(
        429,
        `Please wait ${remainingTime} seconds before requesting a resend.`,
      );
    }

    // Resend verification
    const token = existingUser.generateVerificationToken();
    await existingUser.save({ validateBeforeSave: false });
    await sendVerificationEmail(email, name, token);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Verification email resent. Please check your inbox.",
        ),
      );
  }

  // 2. New user registration
  const user = new UserModel({ name, email, password });
  const verificationToken = user.generateVerificationToken();
  await user.save(); // pre-save hook will hash password

  // 3. Send verification email via Resend
  await sendVerificationEmail(email, name, verificationToken);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "Registration successful. Please check your email to verify your account.",
      ),
    );
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password required");

  const user = await UserModel.findOne({ email }).select(
    "+password +isVerified",
  );
  if (!user) throw new ApiError(400, "Invalid credentials");

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await UserModel.findById(user._id).select(
    "name email avatar",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "Logged in successfully"),
    );
});

// GET /api/v1/auth/verify-email?token=...
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) throw new ApiError(400, "Verification token is required");

  // Since it's a JWT, we can identify THE USER even if the database field is cleared (reuse/expiry)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // If we're here, the token is expired or altered.
    // BUT we can STILL try to decode it silently to see WHO this was (if we wanted)
    // For now, let's treat expired as just identification if the user is ALREADY verified
    decoded = jwt.decode(token);
    if (!decoded || decoded.purpose !== "verification") {
      throw new ApiError(400, "Invalid verification token.");
    }
  }

  const user = await UserModel.findById(decoded?._id).select("+isVerified +verificationToken");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // If already verified, return SUCCESS with a flag. (Solves reuse/expiry showing error)
  if (user.isVerified) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { alreadyVerified: true }, "Email is already verified."),
      );
  }

  // If NOT verified, check if our token matches and is not expired in the verify attempt
  // Re-verify the token expiry here for non-verified users
  let fullyDecoded;
  try {
    fullyDecoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(400, "Verification link has expired. Please request a new one.");
  }

  // Also check if this token matches what we last sent (to prevent very old tokens from working if multiple were sent)
  if (user.verificationToken !== token) {
     throw new ApiError(400, "Verification link is invalid or has been replaced by a newer one.");
  }

  // Update user verified status
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { alreadyVerified: false },
        "Email verified successfully! You can now log in.",
      ),
    );
});

// POST /api/v1/auth/resend-verification
export const resendVerificationEmailController = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required.");

    const user = await UserModel.findOne({ email }).select(
      "+isVerified +lastVerificationSentAt",
    );

    if (!user) {
      // For security, don't confirm if user exists or not
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "If an account exists with that email, a new verification link was sent.",
          ),
        );
    }

    if (user.isVerified) {
      throw new ApiError(400, "This account is already verified. Please log in.");
    }

    // Cooldown check (60 seconds)
    const now = new Date();
    const lastSent = user.lastVerificationSentAt;
    const cooldownPeriod = 60 * 1000;

    if (lastSent && now - lastSent < cooldownPeriod) {
      const remainingTime = Math.ceil(
        (cooldownPeriod - (now - lastSent)) / 1000,
      );
      throw new ApiError(
        429,
        `Please wait ${remainingTime} seconds before requesting another resend.`,
      );
    }

    // Generate and Send
    const token = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(email, user.name, token);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Verification email resent. Please check your inbox.",
        ),
      );
  },
);

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).select(
    "name email avatar",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
