import './dock.scss'

const Dock = ({windowsState, setWindowsState}) => {

  const isAnyWindowOpen = Object.values(windowsState).some(Boolean);

  return (
    <footer className={`dock ${isAnyWindowOpen ? 'has-active' : ''}`}>
        <div 
          onClick={() => { setWindowsState(state => ({ ...state, github: true })) }}
          className='icon github'><img src="/doc-icons/github.svg" alt="" />
          {windowsState.github && <span className="active-dot"></span>}
          </div>
        <div
          onClick={() => { setWindowsState(state => ({ ...state, note: true })) }} 
          className='icon note'><img src="/doc-icons/note.svg" alt="" />
          {windowsState.note && <span className="active-dot"></span>}
          </div>
        <div
          onClick={() => { setWindowsState(state => ({ ...state, resume: true })) }} 
          className='icon pdf'><img src="/doc-icons/pdf.svg" alt="" />
          {windowsState.resume && <span className="active-dot"></span>}
          </div>
        <div
          onClick={()=>{window.open("https://calendar.google.com/","_blank")}} 
          className='icon calender'><img src="/doc-icons/calender.svg" alt="" />
          </div>
        <div
          onClick={() => { setWindowsState(state => ({ ...state, spotify: true })) }}
          className='icon spotify'><img src="/doc-icons/spotify.svg" alt="" />
          {windowsState.spotify && <span className="active-dot"></span>}
          </div>
        <div
         onClick={()=>{window.open("mailto:lalitasolanki2577@gmail.com","_blank")}}
          className='icon mail'><img src="/doc-icons/mail.svg" alt="" /></div>
        <div
          onClick={()=>{window.open("https://www.linkedin.com/in/harsh-solanki-cse/","_blank")}}
          className='icon linkedin'><img src="/doc-icons/linkedin_v2.svg" alt="" /></div>
        <div
         onClick={() => { setWindowsState(state => ({ ...state, cli: true })) }}
          className='icon cli'><img src="/doc-icons/cli.svg" alt="" />
          {windowsState.cli && <span className="active-dot"></span>}
          </div>
    </footer>
  )
}

export default Dock