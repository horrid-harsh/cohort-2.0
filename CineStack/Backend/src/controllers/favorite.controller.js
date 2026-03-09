const asyncHandler = require("express-async-handler");
const Favorite = require("../models/favorite.model");
const { validateMediaType } = require("../utils/validation");

/**
 * @desc Add Content to Favorites
 * @route POST /api/v1/favorites/add
 * @access Private
 */
exports.addFavorite = asyncHandler(async (req, res) => {
  const { tmdbId, title, posterPath, type } = req.body;

  if (!tmdbId || !title || !type) {
    const error = new Error("TMDB ID, Title, and Media Type are required");
    error.statusCode = 400;
    throw error;
  }

  validateMediaType(type, res);

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({
    user: req.user._id,
    tmdbId,
  });

  if (existingFavorite) {
    const error = new Error("This item is already in your favorites");
    error.statusCode = 409;
    throw error;
  }

  const favorite = await Favorite.create({
    user: req.user._id,
    tmdbId,
    title,
    posterPath,
    type,
  });

  res.status(201).json({
    success: true,
    message: `${title} added to favorites`,
    favorite: {
      _id: favorite._id,
      tmdbId: favorite.tmdbId,
      title: favorite.title,
      posterPath: favorite.posterPath,
      type: favorite.type,
      addedAt: favorite.addedAt,
    },
  });
});

/**
 * @desc Remove Content from Favorites
 * @route DELETE /api/v1/favorites/:tmdbId
 * @access Private
 */
exports.removeFavorite = asyncHandler(async (req, res) => {
  const { tmdbId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    user: req.user._id,
    tmdbId,
  });

  if (!favorite) {
    const error = new Error("Favorite item not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Removed from favorites successfully",
  });
});

/**
 * @desc Get All Favorites for Current User
 * @route GET /api/v1/favorites
 * @access Private
 */
exports.getFavorites = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const favorites = await Favorite.find({ user: req.user._id })
    .sort({ addedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Favorite.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    count: favorites.length,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    favorites,
  });
});
