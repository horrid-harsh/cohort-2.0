const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
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
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Compound index for fast queries: fetch most recent history by user efficiently
watchHistorySchema.index({ user: 1, watchedAt: -1 });

// Ensure a user doesn't have duplicate entries for same TMDB ID, but update watchedAt instead (handled in controller)
// Or we can just allow duplicates if requested, but generally, one entry per movie in history is cleaner.
// For now, we'll keep it simple for high performance.

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

module.exports = WatchHistory;
