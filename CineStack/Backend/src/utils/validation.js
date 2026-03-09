/**
 * Utility: Validate Media Type
 * Ensures mediaType is either 'movie' or 'tv'
 */
const validateMediaType = (mediaType, res) => {
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
  if (isNaN(id)) {
    const error = new Error("Invalid ID. It must be a numeric value");
    error.statusCode = 400;
    throw error;
  }
  return true;
};

module.exports = {
  validateMediaType,
  validateId,
};
