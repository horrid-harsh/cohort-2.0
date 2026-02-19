const express = require("express");
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

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

module.exports = authRouter;