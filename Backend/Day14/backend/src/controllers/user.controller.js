const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");
const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

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

    const existingFollow = await followModel.findOne({
      follower: followerId,
      following: followeeUser._id,
    });

    if (existingFollow) {
      if (existingFollow.status === "pending") {
        return res.status(400).json({
          message: "Follow request already sent",
        });
      }

      if (existingFollow.status === "accepted") {
        return res.status(400).json({
          message: "You are already following this user",
        });
      }
    }

    const status = followeeUser.isPrivate ? "pending" : "accepted";

    const followRecord = await followModel.create({
      follower: followerId,
      following: followeeUser._id,
      status,
    });

    return res.status(201).json({
      message:
        status === "pending"
          ? "Follow request sent"
          : `You are now following ${followeeUsername}`,
      followRecord,
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

    const followRecord = await followModel.findOne({
      follower: followerId,
      following: followeeUser._id,
    });

    if (!followRecord) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    const message =
      followRecord.status === "pending"
        ? "Follow request cancelled"
        : `You have unfollowed ${followeeUsername}`;

    await followRecord.deleteOne();

    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * Reject a follow request
 *
 * @route POST /api/users/reject-follow-request/:id
 * @access Private
 */
async function rejectFollowRequest(req, res) {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    const followRequest = await followModel.findOne({
      _id: requestId,
      following: userId,
      status: "pending",
    });

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found",
      });
    }

    await followRequest.deleteOne();

    return res.status(200).json({
      message: "Follow request rejected",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * Accept a follow request
 *
 * @route POST /api/users/accept-follow-request/:id
 * @access Private
 */
async function acceptFollowRequest(req, res) {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    const followRequest = await followModel.findOne({
      _id: requestId,
      following: userId,
      status: "pending",
    });

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found",
      });
    }

    followRequest.status = "accepted";
    await followRequest.save();

    return res.status(200).json({
      message: "Follow request accepted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * Toggle account privacy
 *
 * @route POST /api/users/toggle-account-privacy
 * @access Private
 */
async function toggleAccountPrivacy(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.isPrivate = !user.isPrivate;
    await user.save();
    return res.status(200).json({
      message: `Account is now ${user.isPrivate ? "private" : "public"}`,
      isPrivate: user.isPrivate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * Update user profile
 * @route PATCH /api/users/update-profile
 * @access Private
 */
async function updateProfileController(req, res) {
  try {
    const userId = req.user.id;
    const { username, bio, isPrivate } = req.body;
    let updateData = {};

    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const user = await userModel.findById(userId);

    if (req.file) {
      // Compress and upload new profile image
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400, fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadResponse = await imageKit.files.upload({
        file: await toFile(compressedBuffer, "profile.jpg"),
        fileName: `profile-${userId}-${Date.now()}.jpg`,
        folder: "insta-clone-profiles",
      });

      updateData.profileImage = uploadResponse.url;
      updateData.profileImageFileId = uploadResponse.fileId;

      // Delete old profile image if it exists (Non-blocking)
      if (user.profileImageFileId) {
        imageKit.files.delete(user.profileImageFileId).catch((err) => {
          console.error("Failed to delete old profile image:", err);
        });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
    });

    if (!updatedUser) {
      throw new Error("User not found after update");
    }

    // Only re-issue token if username actually changed
    if (username && username !== user.username) {
      try {
        const newToken = jwt.sign(
          {
            id: updatedUser._id,
            username: updatedUser.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" },
        );
        res.cookie("token", newToken);
      } catch (tokenErr) {
        console.error("Token generation failed:", tokenErr);
      }
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
        isPrivate: updatedUser.isPrivate,
      },
    });
  } catch (error) {
    console.error("Profile update error details:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }
    return res.status(500).json({
      message: error.message || "Failed to update profile",
    });
  }
}

/**
 * Get user profile stats and info
 * @route GET /api/users/profile/:username
 * @access Private
 */
async function getUserProfileController(req, res) {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postsCount = await postModel.countDocuments({ user: user._id });
    const followersCount = await followModel.countDocuments({
      following: user._id,
      status: "accepted",
    });
    const followingCount = await followModel.countDocuments({
      follower: user._id,
      status: "accepted",
    });

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
        isPrivate: user.isPrivate,
      },
      stats: {
        postsCount,
        followersCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get followers list
 * @route GET /api/users/followers/:username
 * @access Private
 */
async function getFollowersController(req, res) {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followers = await followModel
      .find({ following: user._id, status: "accepted" })
      .populate("follower", "username profileImage bio");

    const followerUsers = followers.map((f) => f.follower);

    return res.status(200).json({ followers: followerUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get following list
 * @route GET /api/users/following/:username
 * @access Private
 */
async function getFollowingController(req, res) {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = await followModel
      .find({ follower: user._id, status: "accepted" })
      .populate("following", "username profileImage fullname bio");

    const followingUsers = following.map((f) => f.following);

    return res.status(200).json({ following: followingUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  acceptFollowRequest,
  rejectFollowRequest,
  toggleAccountPrivacy,
  updateProfileController,
  getUserProfileController,
  getFollowersController,
  getFollowingController,
};
