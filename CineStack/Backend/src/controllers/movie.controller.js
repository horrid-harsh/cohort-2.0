const asyncHandler = require("express-async-handler");
const { fetchFromTMDB } = require("../utils/tmdb.service");
const { validateMediaType, validateId } = require("../utils/validation");

/**
 * @desc Get Trending Content (Movies or TV Shows)
 * @route GET /api/v1/movies/trending/:mediaType/:timeWindow
 * @access Public
 */
exports.getTrendingContent = asyncHandler(async (req, res) => {
  const { mediaType, timeWindow } = req.params;

  // Manual validation here because 'all' is accepted for trending
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
  const { page = 1 } = req.query;

  validateMediaType(mediaType, res);

  const data = await fetchFromTMDB(`${mediaType}/popular`, { page });

  res.status(200).json({
    success: true,
    content: data.results,
    currentPage: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  });
});

/**
 * @desc Get Details for a Movie or TV Show
 * @route GET /api/v1/movies/details/:mediaType/:id
 * @access Public
 */
exports.getContentDetails = asyncHandler(async (req, res) => {
  const { mediaType, id } = req.params;

  validateMediaType(mediaType, res);
  validateId(id, res);

  const data = await fetchFromTMDB(`${mediaType}/${id}`);

  res.status(200).json({
    success: true,
    content: data,
  });
});

/**
 * @desc Get Trailers for a Movie or TV Show
 * @route GET /api/v1/movies/trailers/:mediaType/:id
 * @access Public
 */
exports.getContentTrailers = asyncHandler(async (req, res) => {
  const { mediaType, id } = req.params;

  validateMediaType(mediaType, res);
  validateId(id, res);

  const data = await fetchFromTMDB(`${mediaType}/${id}/videos`);

  // Filter for YouTube and sort: Trailers (priority 1), Teasers (priority 2)
  const trailers = data.results
    .filter(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    )
    .sort((a, b) => {
      if (a.type === "Trailer" && b.type === "Teaser") return -1;
      if (a.type === "Teaser" && b.type === "Trailer") return 1;
      return 0;
    });

  if (trailers.length === 0) {
    return res.status(200).json({
      success: true,
      trailers: [],
      message: "Trailer for this content is currently unavailable",
    });
  }

  res.status(200).json({
    success: true,
    trailers,
  });
});

/**
 * @desc Search for Movies, TV Shows, or People
 * @route GET /api/v1/movies/search/:mediaType
 * @access Public
 */
exports.searchContent = asyncHandler(async (req, res) => {
  const { mediaType } = req.params;
  const { query, page = 1 } = req.query;

  const validSearchTypes = ["movie", "tv", "person", "multi"];
  if (!validSearchTypes.includes(mediaType)) {
    res.status(400);
    throw new Error(
      "Invalid search type. Use 'movie', 'tv', 'person', or 'multi'",
    );
  }

  if (!query || query.trim().length === 0) {
    res.status(400);
    throw new Error("Search query is required");
  }

  const data = await fetchFromTMDB(`search/${mediaType}`, {
    query: query.trim(),
    page,
    include_adult: false,
  });

  res.status(200).json({
    success: true,
    results: data.results,
    currentPage: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  });
});
