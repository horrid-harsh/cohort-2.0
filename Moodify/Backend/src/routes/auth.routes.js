const { Router } = require("express");
const router = Router();

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
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post("/refresh", authController.refreshController);

module.exports = router;