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

  return (
   <>
    <main>
      <Navbar />
      <Dock windowsState={windowsState} setWindowsState={setWindowsState} />
      { windowsState.github && <GitHub windowName="github" setWindowsState={setWindowsState} />}
      { windowsState.note && <Note windowName="note" setWindowsState={setWindowsState} />}
      { windowsState.resume && <Resume windowName="resume" setWindowsState={setWindowsState} />}
      { windowsState.spotify && <Spotify windowName="spotify" setWindowsState={setWindowsState} />}
      { windowsState.cli && <Cli windowName="cli" setWindowsState={setWindowsState} />}
    </main>
   </>
  )
}

export default App
