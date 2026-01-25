import { useState } from 'react'
import './app.scss'
import Dock from './components/dock'
import Navbar from './components/Navbar'

function App() {

  return (
   <>
    <main>
      <Navbar />
      <Dock />
    </main>
   </>
  )
}

export default App
