const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Follower is required"],
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Following is required"],
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "accepted"],
        message: "Status can only be pending or accepted",
      },
    },
  },
  { timestamps: true },
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel = mongoose.model("follows", followSchema);
module.exports = followModel;
