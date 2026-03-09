const express = require("express");
const {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllAdminMovies,
} = require("../controllers/admin.controller");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes in this file require Admin authorization
router.use(protect);
router.use(authorizeRoles("admin"));

/**
 * Movie Management Routes
 */
router.route("/movies").get(getAllAdminMovies).post(addMovie);

router.route("/movies/:id").put(updateMovie).delete(deleteMovie);

module.exports = router;
