const express = require("express");
const {
  saveToHistory,
  getHistory,
  clearHistory,
} = require("../controllers/history.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All history routes are protected
router.use(protect);

router.post("/", saveToHistory);
router.get("/", getHistory);
router.delete("/", clearHistory);

module.exports = router;
