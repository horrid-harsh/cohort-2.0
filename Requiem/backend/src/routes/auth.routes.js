import { Router } from "express";
import { register, login, logout, getMe, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access public
 */
router.post("/register", authLimiter, register);

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access public
 */
router.post("/login", authLimiter, login);

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

export default router;