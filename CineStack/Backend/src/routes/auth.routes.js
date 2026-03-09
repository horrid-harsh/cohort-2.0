const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
