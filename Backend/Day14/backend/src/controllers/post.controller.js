const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const sharp = require("sharp");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * Handles post creation
 * @route POST /api/posts
 * @access Private
 */
async function createPostController(req, res) {
  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1080, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();

    const uploadResponse = await imageKit.files.upload({
      file: await toFile(compressedBuffer, "image.jpg"), // 👈 BUFFER USED HERE
      fileName: req.file.originalname, // keep original name
      folder: "cohort-2-insta-clone-posts",
    });

    // console.log(uploadResponse);

    const post = await postModel.create({
      caption: req.body.caption,
      imgUrl: uploadResponse.url,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
}

/**
 * Handles post fetching
 * @route GET /api/posts
 * @access Private
 */
async function getPostController(req, res) {
  try {
    const userId = req.user.id;
    const posts = await postModel.find({
      user: userId,
    });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
}

/**
 * Handles post details fetching
 * @route GET /api/posts/:postId
 * @access Private
 */
async function getPostDetailsController(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await postModel.findById(postId);

    if (!post)
      return res.status(404).json({
        message: "Post not found",
      });

    const isValidUser = post.user.toString() === userId;

    if (!isValidUser)
      return res.status(403).json({
        message: "Forbidden Content",
      });

    return res.status(200).json({
      message: "Post fetched successully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch post details",
    });
  }
}

/**
 * Like a post
 *
 * @route   POST /api/users/like/:postId
 * @access  Private
 */
async function likePostController(req, res) {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const isAlreadyLiked = await likeModel.findOne({
            user: userId,
            post: postId,
        });

        if(isAlreadyLiked){
            return res.status(400).json({
                message: "You have already liked this post",
            });
        }

        const likeRecord = await likeModel.create({
            user: userId,
            post: postId,
        });

        return res.status(201).json({
            message: "Post liked successfully",
            like: likeRecord,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * Dislike a post
 *
 * @route   POST /api/users/dislike/:postId
 * @access  Private
 */
async function dislikePostController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const isAlreadyLiked = await likeModel.findOne({
          user: userId,
          post: postId
        })

        if(!isAlreadyLiked) {
          return res.status(400).json({
            message: "You haven't liked this post"
          })
        }

        await likeModel.deleteOne({
          user: userId,
          post: postId,
        })

        return res.status(200).json({
          message: "Post disliked successfully",
        })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } 
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  dislikePostController,
};
