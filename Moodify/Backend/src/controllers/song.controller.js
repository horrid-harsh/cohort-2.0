const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

const uploadSong = async (req, res) => {
  try {
    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    const tags = id3.read(songBuffer);
    // console.log(tags);
    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        fileName: tags.title + ".mp3",
        folder: "/cohort-2/Moodify/songs",
      }),
      storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        fileName: tags.title + ".jpeg",
        folder: "/cohort-2/Moodify/posters",
      }),
    ]);

    const song = await songModel.create({
      title: tags.title,
      url: songFile.url,
      posterUrl: posterFile.url,
      mood,
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
    const song = await songModel.findOne({ mood });
    res.status(200).json({ message: "Song fetched successfully", song });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadSong,
  getSongController,
};
