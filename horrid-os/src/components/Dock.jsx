import './dock.scss'

const Dock = ({ windowsState, setWindowsState, setMinimizedWindows }) => {

  const isAnyWindowOpen = Object.values(windowsState).some(Boolean);

  // const handleDockClick = (app) => {
  //   setWindowsState(state => {
  //     if (!state[app]) {
  //       return { ...state, [app]: true };
  //     }
  //     return state;
  //   });

  //   setMinimizedWindows(state => {
  //     if (!windowsState[app]) {
  //       return { ...state, [app]: false };
  //     }

  //     if (state[app]) {
  //       return { ...state, [app]: false };
  //     }

  //     return { ...state, [app]: true };
  //   });
  // };

  return (
    <footer className={`dock ${isAnyWindowOpen ? 'has-active' : ''}`}>
        <div 
          onClick={() => {
            setWindowsState(state => ({ ...state, github: true }));
            setMinimizedWindows(state => ({ ...state, github: false }));
          }}
          className='icon github'><img src="/doc-icons/github.svg" alt="" />
          {windowsState.github && <span className="active-dot"></span>}
          </div>

        <div
          onClick={() => { 
            setWindowsState(state => ({ ...state, note: true }));
            setMinimizedWindows(state => ({ ...state, note: false }));
           }} 
          className='icon note'><img src="/doc-icons/note.svg" alt="" />
          {windowsState.note && <span className="active-dot"></span>}
          </div>

        <div
          onClick={() => { 
            setWindowsState(state => ({ ...state, resume: true }));
            setMinimizedWindows(state => ({ ...state, resume: false }));
           }} 
          className='icon pdf'><img src="/doc-icons/pdf.svg" alt="" />
          {windowsState.resume && <span className="active-dot"></span>}
          </div>

        <div
          onClick={()=>{window.open("https://calendar.google.com/","_blank")}} 
          className='icon calender'><img src="/doc-icons/calender.svg" alt="" />
          </div>

        <div
          onClick={() => { 
            setWindowsState(state => ({ ...state, spotify: true }));
            setMinimizedWindows(state => ({ ...state, spotify: false }))
         }}
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
         onClick={() => { 
          setWindowsState(state => ({ ...state, cli: true }));
          setMinimizedWindows(state => ({...state, cli: false}));
        }}
          className='icon cli'><img src="/doc-icons/cli.svg" alt="" />
          {windowsState.cli && <span className="active-dot"></span>}
          </div>
    </footer>
  )
}

export default Dock