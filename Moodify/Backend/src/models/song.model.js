const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: { values: ["happy", "sad", "surprised"], message: "Invalid mood" },
    },
    artist: {
      type: String,
      default: "Unknown Artist",
    },
    duration: {
      type: Number,
      default: 0,
    },
    fileId: {
      type: String,
      required: true,
    },
    posterFileId: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const songModel = mongoose.model("songs", songSchema);
module.exports = songModel;
