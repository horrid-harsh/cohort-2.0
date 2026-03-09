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
    res.status(404);
    throw new Error("Movie not found");
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
    res.status(404);
    throw new Error("Movie not found");
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

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllAdminMovies,
};
