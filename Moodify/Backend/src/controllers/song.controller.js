const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");
const mm = require("music-metadata");

const uploadSong = async (req, res) => {
  try {
    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    // Minimal metadata extraction for Artist and Duration
    const tags = id3.read(songBuffer);
    const metadata = await mm.parseBuffer(songBuffer, {
      mimeType: req.file.mimetype,
    });

    const title = tags.title || metadata.common.title || "Unknown Title";
    const artist = tags.artist || metadata.common.artist || "Unknown Artist";
    const duration = metadata.format.duration || 0;

    const posterBuffer =
      tags.image?.imageBuffer || metadata.common.picture?.[0]?.data;

    let songFile, posterFile;

    if (posterBuffer) {
      const [_songFile, _posterFile] = await Promise.all([
        storageService.uploadFile({
          buffer: songBuffer,
          fileName: `${title}.mp3`,
          folder: "/cohort-2/Moodify/songs",
        }),
        storageService.uploadFile({
          buffer: posterBuffer,
          fileName: `${title}.jpeg`,
          folder: "/cohort-2/Moodify/posters",
        }),
      ]);
      songFile = _songFile;
      posterFile = _posterFile;
    } else {
      songFile = await storageService.uploadFile({
        buffer: songBuffer,
        fileName: `${title}.mp3`,
        folder: "/cohort-2/Moodify/songs",
      });
      // Set the local vinyl record as default if no image exists
      posterFile = { url: "/black-vinyl.jpg" };
    }

    const song = await songModel.create({
      title,
      artist,
      duration,
      url: songFile.url,
      posterUrl: posterFile.url,
      mood,
      uploadedBy: req.user.id,
    });

    res
      .status(201)
      .json({ success: true, message: "Song uploaded successfully", song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSongController = async (req, res) => {
  try {
    const { mood } = req.query;
    const songs = await songModel
      .find(mood ? { mood } : {})
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      songs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await songModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadSong,
  getSongController,
  deleteSong,
};
