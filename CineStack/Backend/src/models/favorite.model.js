const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
    },
    type: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Unique index: prevent a user from adding the same movie to favorites multiple times
favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

// Index for fast retrieval of a specific user's favorites sorted by date
favoriteSchema.index({ user: 1, addedAt: -1 });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
