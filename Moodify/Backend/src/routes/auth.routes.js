const passport = require("passport");
const { Router } = require("express");
const router = Router();
const authUser = require("../middlewares/auth.middleware");
const { authLimiter, refreshLimiter, registerLimiter } = require("../middlewares/rateLimiter");
const authController = require("../controllers/auth.controller");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerLimiter, authController.registerController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", authLimiter, authController.loginController);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get("/me", authUser, authController.getMeController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
router.post("/logout", authUser, authController.logoutController);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post("/refresh", refreshLimiter, authController.refreshController);

/**
 * @route POST /api/auth/forgot-password
 * @desc Forgot password
 * @access Public
 */
router.post("/forgot-password", authLimiter, authController.forgotPasswordController);

/**
 * @route POST /api/auth/reset-password/:token
 * @desc Reset password
 * @access Public
 */
router.post("/reset-password/:token", authLimiter, authController.resetPasswordController);

/**
 * @route GET /api/auth/google
 * @desc Login with Google
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route GET /api/auth/google/callback
 * @desc Google OAuth callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  authController.googleAuthController
);

module.exports = router;