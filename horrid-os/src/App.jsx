import './app.scss'
import Dock from './components/dock'
import Navbar from './components/Navbar'
import MacWindow from './components/windows/MacWindow'
import GitHub from './components/windows/GitHub'
import Note from './components/windows/Note'
import Resume from './components/windows/Resume'
import Spotify from './components/windows/Spotify'

function App() {

  return (
   <>
    <main>
      <Navbar />
      <Dock />
      <GitHub />
      <Note />
      <Resume />
      <Spotify />
    </main>
   </>
  )
}

export default App
