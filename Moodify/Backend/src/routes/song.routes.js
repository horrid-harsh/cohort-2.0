const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const songController = require("../controllers/song.controller");

/**
 * @route POST /api/song
 * @description Upload a song
 * @access Private
 */
router.post("/", authUser, upload.single("song"), songController.uploadSong);

/**
 * @route GET /api/song
 * @description Get a song
 * @access Private
 */
router.get("/", authUser, songController.getSongController);

/**
 * @route DELETE /api/song/:id
 * @description Delete a song
 * @access Private
 */
router.delete("/:id", authUser, songController.deleteSong);

module.exports = router;
