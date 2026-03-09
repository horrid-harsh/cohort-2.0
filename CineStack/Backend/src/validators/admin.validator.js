const { body } = require("express-validator");

const movieValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("posterPath")
    .trim()
    .notEmpty()
    .withMessage("Poster path is required")
    .isURL()
    .withMessage("Please provide a valid URL for the poster image"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("releaseDate")
    .notEmpty()
    .withMessage("Release date is required")
    .isISO8601()
    .withMessage("Please provide a valid date format (YYYY-MM-DD)"),

  body("trailerUrl")
    .trim()
    .notEmpty()
    .withMessage("Trailer URL is required")
    .matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)
    .withMessage("Please provide a valid YouTube URL"),

  body("genre")
    .isArray({ min: 1 })
    .withMessage("Genre must be an array with at least one item"),

  body("genre.*")
    .trim()
    .notEmpty()
    .withMessage("Each genre must be a non-empty string"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["movie", "tv"])
    .withMessage("Category must be either 'movie' or 'tv'"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("Rating must be between 0 and 10"),
];

const updateMovieValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("posterPath")
    .optional()
    .trim()
    .isURL()
    .withMessage("Please provide a valid URL for the poster image"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("releaseDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date format (YYYY-MM-DD)"),

  body("trailerUrl")
    .optional()
    .trim()
    .matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)
    .withMessage("Please provide a valid YouTube URL"),

  body("genre")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Genre must be an array with at least one item"),

  body("genre.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Each genre must be a non-empty string"),

  body("category")
    .optional()
    .trim()
    .isIn(["movie", "tv"])
    .withMessage("Category must be either 'movie' or 'tv'"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("Rating must be between 0 and 10"),
];

module.exports = {
  movieValidator,
  updateMovieValidator,
};
