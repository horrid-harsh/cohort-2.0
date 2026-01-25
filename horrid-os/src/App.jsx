import { useState } from 'react'
import './app.scss'
import Dock from './components/dock'
import Navbar from './components/Navbar'
import MacWindow from './components/windows/MacWindow'

function App() {

  return (
   <>
    <main>
      <Navbar />
      <Dock />
      <MacWindow>
        
      </MacWindow>
    </main>
   </>
  )
}

export default App
