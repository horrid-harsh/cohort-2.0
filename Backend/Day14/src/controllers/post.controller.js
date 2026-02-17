const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const sharp = require('sharp');

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorised access",
    });
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const compressedBuffer = await sharp(req.file.buffer)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toBuffer();

    const uploadResponse = await imageKit.files.upload({
      file: await toFile(compressedBuffer, "image.jpg"), // 👈 BUFFER USED HERE
      fileName: req.file.originalname, // keep original name
      folder: "cohort-2-insta-clone-posts",
    });

    console.log(uploadResponse);

    const post = await postModel.create({
      caption: req.body.caption,
      imgUrl: uploadResponse.url,
      user: decoded.id,
    });

    await userModel.findByIdAndUpdate(decoded.id, {
      $push: {posts: post._id}
    })

    return res.status(201).json({
      message: "post created successfully",
      post
    });
  } catch (error) {
    return res.status(401).json({
      message: "User not authorized"
    })
  }
}

async function getPostController(req, res) {
  const token = req.cookies.token;

  if(!token) return res.status(401).json({
    message: 'Unauthorized Access'
  });

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  const userId = decoded.id;
  const posts = await postModel.find({
    user: userId
  });

  return res.status(200).json({
    message: 'Posts fetched successfully',
    posts
  });
}

async function getPostDetailsController(req, res) {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({
    message: 'Unauthorized Access'
  });

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  const userId = decoded.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if(!post) return res.status(404).json({
    mesage: 'Post not found'
  });

  const isValidUser = post.user.toString() === userId;

  if(!isValidUser) return res.status(403).json({
    message: 'Forbidden Content'
  });

  return res.status(200).json({
    message: 'Post fetched successully',
    post
  });

}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController
};
