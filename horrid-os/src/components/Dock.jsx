import './dock.scss'

const Dock = ({ windowsState, setWindowsState, setMinimizedWindows }) => {

  const isAnyWindowOpen = Object.values(windowsState).some(Boolean);

  const handleDockClick = (app) => {
    setWindowsState(state => {
      if (!state[app]) {
        return { ...state, [app]: true };
      }
      return state;
    });

    setMinimizedWindows(state => {

      // CASE 1:
      // If the app was CLOSED before this click,
      // we are opening it for the first time.
      // So the window should NOT be minimized.
      if (!windowsState[app]) {
        return { 
          ...state, 
          [app]: false  // visible window
        };
      }

      // CASE 2:
      // If the app is already OPEN but currently MINIMIZED,
      // clicking the dock icon should RESTORE the window.
      if (state[app]) {
        return { 
          ...state, 
          [app]: false  // un-minimize (show window)
        };
      }

      // CASE 3:
      // If the app is OPEN and currently VISIBLE,
      // clicking the dock icon should MINIMIZE it.
      return { 
        ...state, 
        [app]: true   // hide window
      };
    });
  };

  return (
    <footer className={`dock ${isAnyWindowOpen ? 'has-active' : ''}`}>
        <div 
          onClick={() => handleDockClick('github')}
          className='icon github'><img src="/doc-icons/github.svg" alt="" />
          {windowsState.github && <span className="active-dot"></span>}
          </div>

        <div
          onClick={() => handleDockClick('note')} 
          className='icon note'><img src="/doc-icons/note.svg" alt="" />
          {windowsState.note && <span className="active-dot"></span>}
          </div>

        <div
          onClick={() => handleDockClick('resume')}
          className='icon pdf'><img src="/doc-icons/pdf.svg" alt="" />
          {windowsState.resume && <span className="active-dot"></span>}
          </div>

        <div
          onClick={()=>{window.open("https://calendar.google.com/","_blank")}} 
          className='icon calendar'><img src="/doc-icons/calendar.svg" alt="" />
          </div>

        <div
          onClick={() => handleDockClick('spotify')}
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
         onClick={() => handleDockClick('cli')}
          className='icon cli'><img src="/doc-icons/cli.svg" alt="" />
          {windowsState.cli && <span className="active-dot"></span>}
          </div>
    </footer>
  )
}

export default Dock