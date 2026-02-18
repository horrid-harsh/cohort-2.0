const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");

/**
 * Follow a user
 *
 * @route   POST /api/users/follow/:username
 * @access  Private
 */
async function followUserController(req, res) {
  try {
    const followerId = req.user.id;
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    if (followerUsername === followeeUsername) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const followeeUser = await userModel.findOne({
      username: followeeUsername,
    });

    if (!followeeUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isAlreadyFollowing = await followModel.findOne({
      follower: followerId,
      following: followeeUser._id,
    });

    if (isAlreadyFollowing) {
      return res.status(400).json({
        message: "You are already following this user",
      });
    }

    const followRecord = await followModel.create({
      follower: followerId,
      following: followeeUser._id,
    });

    return res.status(201).json({
      message: `You are now following ${followeeUsername}`,
      follow: followRecord,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * Unfollow a user
 *
 * @route   POST /api/users/unfollow/:username
 * @access  Private
 */
async function unfollowUserController(req, res) {
  try {
    const followerId = req.user.id;
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    if (followerUsername === followeeUsername) {
      return res.status(400).json({
        message: "You cannot unfollow yourself",
      });
    }

    const followeeUser = await userModel.findOne({
      username: followeeUsername,
    });

    if (!followeeUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isAlreadyFollowing = await followModel.findOne({
      follower: followerId,
      following: followeeUser._id,
    });

    if (!isAlreadyFollowing) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    await followModel.deleteOne({
      follower: followerId,
      following: followeeUser._id,
    });

    return res.status(200).json({
      message: `You have unfollowed ${followeeUsername}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
};
