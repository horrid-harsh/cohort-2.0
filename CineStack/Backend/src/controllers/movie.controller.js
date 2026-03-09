const asyncHandler = require("express-async-handler");
const { fetchFromTMDB } = require("../utils/tmdb.service");

/**
 * @desc Get Trending Content (Movies or TV Shows)
 * @route GET /api/v1/movies/trending/:mediaType/:timeWindow
 * @access Public
 */
exports.getTrendingContent = asyncHandler(async (req, res) => {
  const { mediaType, timeWindow } = req.params;

  // Validate mediaType and timeWindow
  const validMediaTypes = ["movie", "tv", "all"];
  const validTimeWindows = ["day", "week"];

  if (
    !validMediaTypes.includes(mediaType) ||
    !validTimeWindows.includes(timeWindow)
  ) {
    res.status(400);
    throw new Error("Invalid media type or time window");
  }

  const data = await fetchFromTMDB(`trending/${mediaType}/${timeWindow}`);

  res.status(200).json({
    success: true,
    content: data.results,
  });
});

/**
 * @desc Get Popular Content (Movies or TV Shows)
 * @route GET /api/v1/movies/popular/:mediaType
 * @access Public
 */
exports.getPopularContent = asyncHandler(async (req, res) => {
  const { mediaType } = req.params;

  const validMediaTypes = ["movie", "tv"];

  if (!validMediaTypes.includes(mediaType)) {
    res.status(400);
    throw new Error("Invalid media type. Must be 'movie' or 'tv'");
  }

  // ✅ Support page query param
  const { page = 1 } = req.query;
  const data = await fetchFromTMDB(`${mediaType}/popular`, { page });

  // ✅ Frontend needs this for infinite scroll
  res.status(200).json({
    success: true,
    content: data.results,
    currentPage: data.page, 
    totalPages: data.total_pages, 
    totalResults: data.total_results,
  });
});
