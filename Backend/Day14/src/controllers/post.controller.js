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

    userModel.findByIdAndUpdate(decoded.id, {
      $push: {pots: post._id}
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

module.exports = {
  createPostController,
};
