const express = require("express");
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authUser = require('../middlewares/auth.middleware');

/**
 * Register a new user
 *
 * @route   POST /api/auth/register
 * @access  Public
 */
authRouter.post("/register", authController.registerController);

/**
 * Login a user
 *
 * @route   POST /api/auth/login
 * @access  Public
 */
authRouter.post('/login', authController.loginController);

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
authRouter.get('/me', authUser, authController.getMeController);

module.exports = authRouter;