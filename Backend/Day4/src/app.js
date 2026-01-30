const express = require("express");
const app = express();

const notes = [];

app.use(express.json());

app.listen(3000, () => {
  console.log("server runing on port 3000");
});

app.get("/notes", (req, res) => {
    res.send(notes);
});

app.post("/notes", (req, res) => {
    notes.push(req.body);
    res.send('note created successfully');
});

app.delete("/notes/:idx", (req, res)=> {
    console.log(req.params);
    delete notes[req.params.idx];
    res.send("note deleted successfully")
});

app.patch("/notes/:idx", (req, res)=> {
    notes[ req.params.idx ].description = req.body.description;
    res.send('note updated successfully')
});