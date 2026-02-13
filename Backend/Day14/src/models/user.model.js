const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists!!"],
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists!!"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/lazzzyBug/avatar-default-user-profile-icon-social-media-vector-57234208.webp",
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
