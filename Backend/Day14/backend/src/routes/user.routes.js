const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const postController = require("../controllers/post.controller");
const authUser = require("../middlewares/auth.middleware");

/**
 * @route POST /api/users/toggle-account-privacy [protected]
 * @description toggle account privacy
 * @access protected
 */
userRouter.post(
  "/toggle-account-privacy",
  authUser,
  userController.toggleAccountPrivacy,
);

/**
 * @route POST /api/users/follow/:username [protected]
 * @description follow a user
 * @access protected
 */
userRouter.post(
  "/follow/:username",
  authUser,
  userController.followUserController,
);

/**
 * @route POST /api/users/unfollow/:username [protected]
 * @description unfollow a user
 * @access protected
 */
userRouter.post(
  "/unfollow/:username",
  authUser,
  userController.unfollowUserController,
);

/**
 * @route POST /api/users/accept-follow-request/:id [protected]
 * @description accept a follow req uest
 * @access protected
 */
userRouter.post(
  "/accept-follow-request/:id",
  authUser,
  userController.acceptFollowRequest,
);

/**
 * @route POST /api/users/reject-follow-request/:id [protected]
 * @description reject a follow request
 * @access protected
 */
userRouter.post(
  "/reject-follow-request/:id",
  authUser,
  userController.rejectFollowRequest,
);

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route PATCH /api/users/update-profile [protected]
 * @description update user profile (username, bio, profile image)
 * @access protected
 */
userRouter.patch(
  "/update-profile",
  authUser,
  upload.single("profileImage"),
  userController.updateProfileController,
);

/**
 * @route GET /api/users/profile/:username [protected]
 * @description get user profile details and stats
 * @access protected
 */
userRouter.get(
  "/profile/:username",
  authUser,
  userController.getUserProfileController,
);

module.exports = userRouter;
