const asyncHandler = require("express-async-handler");
const Movie = require("../models/movie.model");

/**
 * @desc Add a new movie (Admin Only)
 * @route POST /api/v1/admin/movies
 * @access Private/Admin
 */
const addMovie = asyncHandler(async (req, res) => {
  const {
    title,
    posterPath,
    description,
    tmdbId,
    releaseDate,
    trailerUrl,
    genre,
    category,
  } = req.body;

  // Prevent duplicates
  const existing = await Movie.findOne({
    $or: [
      { tmdbId: tmdbId || null },
      { title: { $regex: new RegExp(`^${title}$`, "i") } },
    ],
  });

  // ✅ Simplest fix — set statusCode before throwing
  if (existing) {
    const error = new Error("Movie already exists in the database");
    error.statusCode = 409;
    throw error;
  }

  const movie = await Movie.create({
    title,
    posterPath,
    description,
    tmdbId,
    releaseDate,
    trailerUrl,
    genre,
    category,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Movie added to custom database successfully",
    movie,
  });
});

/**
 * @desc Update movie details (Admin Only)
 * @route PUT /api/v1/admin/movies/:id
 * @access Private/Admin
 */
const updateMovie = asyncHandler(async (req, res) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedUpdates = {
    title: req.body.title,
    posterPath: req.body.posterPath,
    description: req.body.description,
    releaseDate: req.body.releaseDate,
    trailerUrl: req.body.trailerUrl,
    genre: req.body.genre,
    category: req.body.category,
    rating: req.body.rating,
  };

  // Remove undefined fields
  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key],
  );

  movie = await Movie.findByIdAndUpdate(req.params.id, allowedUpdates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    movie,
  });
});

/**
 * @desc Delete a movie (Admin Only)
 * @route DELETE /api/v1/admin/movies/:id
 * @access Private/Admin
 */
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = 404;
    throw error;
  }

  await movie.deleteOne();

  res.status(200).json({
    success: true,
    message: "Movie deleted from custom database",
  });
});

/**
 * @desc Get all custom admin movies
 * @route GET /api/v1/admin/movies
 * @access Private/Admin
 */
const getAllAdminMovies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const query = search ? { $text: { $search: search } } : {};

  const movies = await Movie.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Movie.countDocuments(query);

  res.status(200).json({
    success: true,
    count: movies.length,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    movies,
  });
});

const Favorite = require("../models/favorite.model");
const WatchHistory = require("../models/watchHistory.model");
const User = require("../models/user.model");

// Movie Controllers ... (Keeping existing ones)

/**
 * @desc Get all users (Admin Only)
 * @route GET /api/v1/admin/users
 * @access Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build query object
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    users,
  });
});

/**
 * @desc Toggle Ban/Unban User (Admin Only)
 * @route PUT /api/v1/admin/users/:id/ban
 * @access Private/Admin
 */
const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent admin from banning themselves
  if (user._id.toString() === req.user._id.toString()) {
    const error = new Error("You cannot ban yourself");
    error.statusCode = 400;
    throw error;
  }

  user.isBanned = !user.isBanned;
  await user.save();

  res.status(200).json({
    success: true,
    message: user.isBanned ? "User has been banned" : "User has been unbanned",
    isBanned: user.isBanned,
  });
});

/**
 * @desc Delete User and their associated data (Admin Only)
 * @route DELETE /api/v1/admin/users/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    const error = new Error("You cannot delete your own admin account");
    error.statusCode = 400;
    throw error;
  }

  // Cascade delete all associated data
  await Promise.all([
    Favorite.deleteMany({ user: user._id }),
    WatchHistory.deleteMany({ user: user._id }),
    user.deleteOne(),
  ]);

  res.status(200).json({
    success: true,
    message: "User and all associated data deleted successfully",
  });
});

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllAdminMovies,
  getAllUsers,
  toggleBanUser,
  deleteUser,
};
