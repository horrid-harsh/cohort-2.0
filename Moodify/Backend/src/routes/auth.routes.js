const { Router } = require("express");
const router = Router();
const authUser = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authController.registerController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", authController.loginController);

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
router.post("/refresh", authController.refreshController);

module.exports = router;