import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

function App() {

  const [ users, setUsers ] = useState([]);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    axios.get('/api/users')
    .then(response => {
      if (Array.isArray(response.data)) {
        setUsers(response.data)
      } else {
        console.error("API did not return an array:", response.data);
        setError("Invalid data format received");
      }
    })
    .catch(err => {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    })
  }, []);

  return (
    <div className="app">
      <h1>Teammates List</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {Array.isArray(users) && users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App