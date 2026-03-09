const { validationResult } = require("express-validator");

/**
 * Utility: Validate results of express-validator
 * Returns all errors at once in a consistent format
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

/**
 * Utility: Validate Media Type
 * Ensures mediaType is either 'movie' or 'tv'
 */
const validateMediaType = (mediaType) => {
  const validTypes = ["movie", "tv"];
  if (!validTypes.includes(mediaType)) {
    const error = new Error("Invalid media type. Must be 'movie' or 'tv'");
    error.statusCode = 400;
    throw error;
  }
  return true;
};

/**
 * Utility: Validate Numeric ID
 */
const validateId = (id, res) => {
  if (!id || isNaN(id) || Number(id) <= 0) {
    const error = new Error("Invalid ID. Must be a positive numeric value");
    error.statusCode = 400;
    throw error;
  }

  return true;
};

module.exports = {
  validate,
  validateMediaType,
  validateId,
};
