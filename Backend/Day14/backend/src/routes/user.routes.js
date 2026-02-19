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
userRouter.post('/toggle-account-privacy', authUser, userController.toggleAccountPrivacy);

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

/**
 * @route POST /api/users/accept-follow-request/:id [protected]
 * @description accept a follow request
 * @access protected
 */
userRouter.post('/accept-follow-request/:id', authUser, userController.acceptFollowRequest);

/**
 * @route POST /api/users/reject-follow-request/:id [protected]
 * @description reject a follow request
 * @access protected
 */
userRouter.post('/reject-follow-request/:id', authUser, userController.rejectFollowRequest);

/**
 * @route POST /api/users/like/:postId [protected]
 * @description like a post
 * @access protected
 */
userRouter.post('/like/:postId', authUser, postController.likePostController);

/**
 * @route POST /api/users/dislike/:postId [protected]
 * @description dislike a post
 * @access protected
 */
userRouter.post('/dislike/:postId', authUser, postController.dislikePostController);

module.exports = userRouter;