/**
 * Utility: Validate Media Type
 * Ensures mediaType is either 'movie' or 'tv'
 */
const validateMediaType = (mediaType, res) => {
  const validTypes = ["movie", "tv"];
  if (!validTypes.includes(mediaType)) {
    res.status(400);
    throw new Error("Invalid media type. Must be 'movie' or 'tv'");
  }
  return true;
};

/**
 * Utility: Validate Numeric ID
 */
const validateId = (id, res) => {
  if (isNaN(id)) {
    res.status(400);
    throw new Error("Invalid ID. It must be a numeric value");
  }
  return true;
};

module.exports = {
  validateMediaType,
  validateId,
};
