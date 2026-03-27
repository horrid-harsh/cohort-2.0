import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmailController,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter, resetPasswordLimiter } from "../middlewares/rateLimiter.middleware.js";
import { registerSchema, loginSchema, resetPasswordSchema } from "../validators/auth.schema.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access public
 */
router.post("/register", authLimiter, validate(registerSchema), register);

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access public
 */
router.post("/login", authLimiter, validate(loginSchema), login);

/**
 * @description Logout a user
 * @route POST /api/v1/auth/logout
 * @access private
 */
router.post("/logout", verifyJWT, logout);

/**
 * @description Get current user
 * @route GET /api/v1/auth/me
 * @access private
 */
router.get("/me", verifyJWT, getMe);

/**
 * @description Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access public
 */
router.post("/refresh", refreshAccessToken);

/**
 * @description Verify email
 * @route GET /api/v1/auth/verify-email
 * @access public
 */
router.get("/verify-email", verifyEmail);

/**
 * @description Resend verification email
 * @route POST /api/v1/auth/resend-verification
 * @access public
 */
router.post("/resend-verification", resendVerificationEmailController);

/**
 * @description Forgot password
 * @route POST /api/v1/auth/forgot-password
 * @access public
 */
router.post("/forgot-password", authLimiter, forgotPassword);

/**
 * @description Reset password
 * @route POST /api/v1/auth/reset-password
 * @access public
 */
router.post("/reset-password", resetPasswordLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
