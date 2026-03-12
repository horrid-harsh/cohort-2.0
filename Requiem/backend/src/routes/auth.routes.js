import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access public
 */
router.post("/register", register);

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access public
 */
router.post("/login", login);

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

export default router;