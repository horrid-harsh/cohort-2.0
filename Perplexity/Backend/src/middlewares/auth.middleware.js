import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized - No token provided");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decodedToken.id).select("-password");
  if (!user) {
    throw new ApiError(401, "Unauthorized - User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Email not verified. Please verify your email to continue.");
  }

  req.user = user;
  next();
});