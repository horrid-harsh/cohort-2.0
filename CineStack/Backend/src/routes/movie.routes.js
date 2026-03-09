const express = require("express");
const {
  getTrendingContent,
  getPopularContent,
  getContentDetails,
  getContentTrailers,
  searchContent,
} = require("../controllers/movie.controller");

const router = express.Router();

/**
 * Discovery Routes
 */
router.get("/trending/:mediaType/:timeWindow", getTrendingContent);
router.get("/popular/:mediaType", getPopularContent);
router.get("/details/:mediaType/:id", getContentDetails);
router.get("/trailers/:mediaType/:id", getContentTrailers);

/**
 * Search Routes
 */
router.get("/search/:mediaType", searchContent);

module.exports = router;
