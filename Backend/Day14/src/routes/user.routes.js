const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const authUser = require("../middlewares/auth.middleware");

/**
 * @route POST /api/users/follow/:username [protected]
 * @description follow a user
 * @access protected
 */
userRouter.post('/follow/:username', authUser, userController.followUserController);

/**
 * @route POST /api/users/unfollow/:username [protected]
 * @description unfollow a user
 * @access protected
 */
userRouter.post('/unfollow/:username', authUser, userController.unfollowUserController);

module.exports = userRouter;