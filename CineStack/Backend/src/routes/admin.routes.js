const express = require("express");
const {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllAdminMovies,
  getAllUsers,
  toggleBanUser,
  deleteUser,
} = require("../controllers/admin.controller");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validation");
const {
  movieValidator,
  updateMovieValidator,
} = require("../validators/admin.validator");

const router = express.Router();

// All routes in this file require Admin authorization
router.use(protect);
router.use(authorizeRoles("admin"));

/**
 * Movie Management Routes
 */
router
  .route("/movies")
  .get(getAllAdminMovies)
  .post(movieValidator, validate, addMovie);

router
  .route("/movies/:id")
  .put(updateMovieValidator, validate, updateMovie)
  .delete(deleteMovie);

/**
 * User Management Routes
 */
router.get("/users", getAllUsers);
router.put("/users/:id/ban", toggleBanUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
