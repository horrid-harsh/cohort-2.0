import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, resetPasswordSchema } from "../validators/auth.schema.js";
import { 
  registerLimiter, 
  loginLimiter, 
  forgotPasswordLimiter, 
  resendVerificationLimiter,
  refreshTokenLimiter
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access public
 */
router.post("/register", registerLimiter, validate(registerSchema), register);

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access public
 */
router.post("/login", loginLimiter, validate(loginSchema), login);

/**
 * @description Refresh access token
 * @route POST /api/v1/auth/refresh-token
 * @access public
 */
router.post("/refresh-token", refreshTokenLimiter, refreshAccessToken);

/**
 * @description Logout a user
 * @route POST /api/v1/auth/logout
 * @access private
 */
router.post("/logout", authenticate, logout);

/**
 * @description Get current user
 * @route GET /api/v1/auth/me
 * @access private
 */
router.get("/me", authenticate, getMe);

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
router.post("/resend-verification", resendVerificationLimiter, resendVerification);


/**
 * @description Forgot password
 * @route POST /api/v1/auth/forgot-password
 * @access public
 */
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

/**
 * @description Reset password
 * @route POST /api/v1/auth/reset-password
 * @access public
 */
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;