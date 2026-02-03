import { useState, useEffect } from "react";
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  function fetchNotes() {
    axios.get('http://localhost:3000/api/notes')
    .then((res)=>{
      setNotes(res.data.notes);
      console.log(res.data);    
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault();

    console.log(title);
    console.log(description);
    axios.post('http://localhost:3000/api/notes', {
      title: title,
      description: description
    })
    .then((res)=>{
      console.log("response:", res.data);
      fetchNotes();
      setTitle('');
      setDescription('');
    })
    .catch((err) => {
      console.error("Failed to create note", err);
    });    
  }

  const handleDelete = (noteId)=> {
    // axios.delete(`http://localhost:3000/api/notes/${noteId}`)
    axios.delete(`http://localhost:3000/api/notes/`+noteId)
    .then((res)=>{
      console.log(res.data);
      fetchNotes();
    })    
  }

  const handleUpdate = (noteId)=> {
    axios.patch(`http://localhost:3000/api/notes/`+noteId, {
      title: editTitle,
      description: editDescription
    })
    .then((res)=>{
      console.log(res.data); 
      fetchNotes();
      setEditingId(null);     
    })
  }
  
  useEffect(()=>{
    fetchNotes();
  }, [])

  return (
    <>
      <div>
        <form onSubmit={handleSubmit} className="note-create-form">
          <input value={title} onChange={(e)=>{setTitle(e.target.value)}} type="text" placeholder="Enter title" />
          <input value={description} onChange={(e)=>{setDescription(e.target.value)}} type="text" placeholder="Enter description" />
          <button type="submit">Create note</button>
        </form>
      </div>    

     <div className="notes">
  {notes.map((note) => (
    <div className="note" key={note._id}>

      {editingId === note._id ? (
        <>
          <input
            className="edit-input"
            type="text"
            value={editTitle}
              disabled
          />

          <textarea
            className="edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <div className="note-actions">
            <button onClick={()=>{handleUpdate(note._id)}} className="update-btn">
              Update
            </button>

            <button
              className="cancel-btn"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="note-header">
            <h1>{note.title}</h1>

            <div className="icon-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingId(note._id);
                  setEditTitle(note.title);
                  setEditDescription(note.description);
                }}
              >
                ✎
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(note._id)}
              >
                ✕
              </button>
            </div>
          </div>

          <p>{note.description}</p>
        </>
      )}
    </div>
  ))}
</div>

    </>
  );
};

export default App;
