const express = require("express");
const app = express();
const noteModel = require("./models/notes.model");
const cors = require('cors')

app.use(express.json());
app.use(cors());

app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;
  const note = await noteModel.create({
    title,
    description,
  });
  res.status(201).json({
    message: "Note created successfully",
    note,
  });
});

app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();
  res.status(200).json({
    message: "Notes fetched uccessfully",
    notes,
  });
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  await noteModel.findByIdAndDelete(id);
  res.status(200).json({
    message: "Note deleted successfully",
  });
});

app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  await noteModel.findByIdAndUpdate(id, { description });
  res.status(200).json({
    message: 'Note updated successfully'
  })
});

module.exports = app;
