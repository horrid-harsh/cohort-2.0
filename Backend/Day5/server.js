const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, (req, res)=> {
    console.log('server running at port 3000');
});

const notes = [];

app.get('/notes', (req, res)=>{
    res.status(200).json({
        message: 'Notes fetched successfully'
    })
})

app.post('/notes', (req, res)=> {
    notes.push(req.body);
    res.status(201).json({
        message: 'Note created succesfully'
    })
})

app.delete('/notes/:index', (req, res)=> {
    delete notes[ req.params.index ];
    res.status(204).json({
        message: 'Note deleted successfully'
    })
})

app.patch('/notes/:index', (req, res)=> {
    notes[req.params.index].description = req.body.description;
    res.status(200).json({
        message: 'Note updated successfully'
    })
})