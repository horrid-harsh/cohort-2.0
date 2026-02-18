const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controler");
const authUser = require("../middlewares/auth.middleware");

/**
 * @route POST /api/users/follow/:username [protected]
 * @description follow a user
 * @access protected
 */
userRouter.post('/follow/:username', authUser, userController.followUserController);

module.exports = userRouter;