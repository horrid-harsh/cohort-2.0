const express = require("express");
const {
  getTrendingContent,
  getPopularContent,
} = require("../controllers/movie.controller");

const router = express.Router();

/**
 * Discovery Routes
 */
router.get("/trending/:mediaType/:timeWindow", getTrendingContent);
router.get("/popular/:mediaType", getPopularContent);

module.exports = router;
