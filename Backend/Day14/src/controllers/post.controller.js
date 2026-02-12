const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  const uploadResponse = await imageKit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"), // 👈 BUFFER USED HERE
    fileName: req.file.originalname, // keep original name
  });

  res.send(uploadResponse);
}

module.exports = {
  createPostController,
};
