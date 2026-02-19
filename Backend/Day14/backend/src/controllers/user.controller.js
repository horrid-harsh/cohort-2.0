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
    status: "pending"
  })

  if(!followRequest){
    return res.status(404).json({
      message: "Follow request not found"
    })
  }

  await followRequest.deleteOne();

  return res.status(200).json({
    message: "Follow request rejected"
  })
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
      status: "pending"      
    })

    if(!followRequest){
      return res.status(404).json({
        message: "Follow request not found"
      })
    }

    followRequest.status = "accepted"
    await followRequest.save()

    return res.status(200).json({
      message: "Follow request accepted"
    })

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
    if(!user){
      return res.status(404).json({
        message: "User not found"
      })
    }
    user.isPrivate = !user.isPrivate;
    await user.save();
    return res.status(200).json({
      message: `Account is now ${user.isPrivate ? "private" : "public"}`,
      isPrivate: user.isPrivate,
    })
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
  acceptFollowRequest,
  rejectFollowRequest,
  toggleAccountPrivacy
};
