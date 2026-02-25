const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      required: [true, "imgUrl is required"],
    },
    fileId: {
      type: String,
      required: [true, "fileId is required"],
    },
    user: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user id required for creating a post"],
    },
  },
  { timestamps: true },
);

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;
