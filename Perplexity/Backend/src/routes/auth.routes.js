import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  verifyEmail,
  getMe,
  resendVerificationEmail
} from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", authRateLimiter, registerValidator, registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", authRateLimiter, loginValidator, loginUser)

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post("/logout", authUser, logout)

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get('/get-me', authUser, getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */
authRouter.get('/verify-email', verifyEmail)

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend verification email to user
 * @access Public
 * @body { email }
 */
authRouter.post('/resend-verification', authRateLimiter, resendVerificationEmail)

export default authRouter;