const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favorite.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All favorite routes are protected
router.use(protect);

router.post("/", addFavorite);
router.get("/", getFavorites);
router.delete("/:tmdbId", removeFavorite);

module.exports = router;
