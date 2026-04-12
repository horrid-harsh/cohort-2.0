import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";

// ─── Authenticate: verifies access token from cookie or Authorization header ──
export const authenticate = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers?.authorization;

  const token =
    req.cookies?.accessToken ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) {
    throw new ApiError(401, "Access token missing. Please log in.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired. Please refresh.");
    }
    throw new ApiError(401, "Invalid access token.");
  }

  if (!decoded?._id) {
    throw new ApiError(401, "Invalid token payload.");
  }
  
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken -verificationToken -resetPasswordToken"
  );

  if (!user) throw new ApiError(401, "User not found. Token may be stale.");
  if (!user.isActive) throw new ApiError(403, "Your account has been deactivated.");

  req.user = user;
  next();
});

// ─── Authorize: restricts route to specific roles ──────────────────────────
export const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized. Please authenticate first.");
    }

    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        403,
        `Access denied. Required role: [${roles.join(", ")}]`
      );
    }
    next();
});