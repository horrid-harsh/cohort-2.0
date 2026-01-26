import './app.scss'
import Dock from './components/dock'
import Navbar from './components/Navbar'
import MacWindow from './components/windows/MacWindow'
import GitHub from './components/windows/GitHub'
import Note from './components/windows/Note'
import Resume from './components/windows/Resume'
import Spotify from './components/windows/Spotify'
import Cli from './components/windows/Cli'
import { useState } from 'react'

function App() {

  const [windowsState, setWindowsState] = useState({
    github: false,
    note: false,
    resume: false,
    spotify: false,
    cli: false
  })

  const [topZIndex, setTopZIndex] = useState(1)

  return (
   <>
    <main>
      <Navbar />
      <div id="desktop">
         <Dock windowsState={windowsState} setWindowsState={setWindowsState} />
        { windowsState.github && <GitHub windowName="github" setWindowsState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} />}
        { windowsState.note && <Note windowName="note" setWindowsState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} />}
        { windowsState.resume && <Resume windowName="resume" setWindowsState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} />}
        { windowsState.spotify && <Spotify windowName="spotify" setWindowsState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} />}
        { windowsState.cli && <Cli windowName="cli" setWindowsState={setWindowsState} topZIndex={topZIndex} setTopZIndex={setTopZIndex} />}

      </div>
    </main>
   </>
  )
}

export default App
