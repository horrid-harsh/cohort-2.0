import { useState } from 'react'
import './app.scss'
import Dock from './components/dock'
import Navbar from './components/Navbar'
import MacWindow from './components/windows/MacWindow'
import GitHub from './components/windows/GitHub'

function App() {

  return (
   <>
    <main>
      <Navbar />
      <Dock />
      <GitHub />
    </main>
   </>
  )
}

export default App
