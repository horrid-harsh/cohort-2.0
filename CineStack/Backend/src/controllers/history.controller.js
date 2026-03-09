const asyncHandler = require("express-async-handler");
const WatchHistory = require("../models/watchHistory.model");
const { validateMediaType } = require("../utils/validation");

/**
 * @desc Save Content to Watch History
 * @route POST /api/v1/history
 * @access Private
 */
exports.saveToHistory = asyncHandler(async (req, res) => {  
  const { tmdbId, title, posterPath, type } = req.body;

  if (!tmdbId || !title || !type) {
    res.status(400);
    throw new Error("TMDB ID, Title, and Media Type are required");
  }

  validateMediaType(type, res);

  // Check if already in history
  let historyEntry = await WatchHistory.findOne({
    user: req.user._id,
    tmdbId,
  });

  if (historyEntry) {
    // Update timestamp instead of creating new entry
    historyEntry.watchedAt = Date.now();
    await historyEntry.save();
  } else {
    // Create new entry
    historyEntry = await WatchHistory.create({
      user: req.user._id,
      tmdbId,
      title,
      posterPath,
      type,
    });
  }

  // Limit history to last 50 entries
    const historyCount = await WatchHistory.countDocuments({ user: req.user._id });

    if (historyCount > 50) {
      const oldest = await WatchHistory.findOne({ user: req.user._id })
        .sort({ watchedAt: 1 }); // oldest first
      await WatchHistory.findByIdAndDelete(oldest._id);
    }

  res.status(200).json({
    success: true,
    message: `Watched ${title} saved to history`,
    history: historyEntry,
  });
});

/**
 * @desc Get All Watch History for Current User
 * @route GET /api/v1/history
 * @access Private
 */
exports.getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const history = await WatchHistory.find({ user: req.user._id })
    .sort({ watchedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await WatchHistory.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    count: history.length,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    history,
  });
});

/**
 * @desc Clear Entire Watch History
 * @route DELETE /api/v1/history
 * @access Private
 */
exports.clearHistory = asyncHandler(async (req, res) => {
  await WatchHistory.deleteMany({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: "Watch history cleared successfully",
  });
});
