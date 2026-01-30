import { useRef } from 'react';
import './dock.scss'

const Dock = ({ windowsState, setWindowsState, setMinimizedWindows }) => {

  const dockRefs = useRef({});

  const isAnyWindowOpen = Object.values(windowsState).some(Boolean);

  const handleDockClick = (app) => {
    const wasClosed = !windowsState[app];

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

      // 🔴 BOUNCE ONLY HERE
    if (wasClosed) {
      const el = dockRefs.current[app];
      if (!el) return;

      el.classList.add("dock-bounce");
      setTimeout(() => {
        el.classList.remove("dock-bounce");
      }, 800);
    }
  }

  const maxScale = 1.6;
  const minScale = 1;
  const influenceRadius = 120;

  const handleMouseMove = (e) => {
  Object.values(dockRefs.current).forEach(icon => {
    if (!icon) return;

    const rect = icon.getBoundingClientRect();
    const iconCenter = rect.left + rect.width / 2;
    const distance = Math.abs(e.clientX - iconCenter);
    

    let scale =
      maxScale - (distance / influenceRadius) * (maxScale - minScale);

    scale = Math.max(minScale, scale);

    icon.style.transform = `
      scale(${scale})
      translateY(${-(scale - 1) * 25}px)
    `;
  });
};
const resetDock = () => {
  Object.values(dockRefs.current).forEach(icon => {
    if (!icon) return;
    icon.style.transform = 'scale(1)';
  });
};

  return (
    <footer onMouseMove={handleMouseMove} onMouseLeave={resetDock}
      className={`dock ${isAnyWindowOpen ? 'has-active' : ''}`}>
        <div 
        ref={el => (dockRefs.current.github = el)}
          onClick={() => handleDockClick('github')}
          className='icon github'><img src="/doc-icons/github.svg" alt="" />
          {windowsState.github && <span className="active-dot"></span>}
          </div>

        <div
        ref={el => (dockRefs.current.note = el)}
          onClick={() => handleDockClick('note')} 
          className='icon note'><img src="/doc-icons/note.svg" alt="" />
          {windowsState.note && <span className="active-dot"></span>}
          </div>

        <div
        ref={el => (dockRefs.current.resume = el)}
          onClick={() => handleDockClick('resume')}
          className='icon pdf'><img src="/doc-icons/pdf.svg" alt="" />
          {windowsState.resume && <span className="active-dot"></span>}
          </div>

        <div 
        ref={el => (dockRefs.current.calendar = el)}
          onClick={()=>{window.open("https://calendar.google.com/","_blank")}} 
          className='icon calendar'><img src="/doc-icons/calendar.svg" alt="" />
          </div>

        <div
        ref={el => (dockRefs.current.spotify = el)}
          onClick={() => handleDockClick('spotify')}
          className='icon spotify'><img src="/doc-icons/spotify.svg" alt="" />
          {windowsState.spotify && <span className="active-dot"></span>}
        </div>

        <div
        ref={el => (dockRefs.current.mail = el)}
         onClick={()=>{window.open("mailto:lalitasolanki2577@gmail.com","_blank")}}
          className='icon mail'><img src="/doc-icons/mail.svg" alt="" /></div>

        <div
        ref={el => (dockRefs.current.linkedin = el)}
          onClick={()=>{window.open("https://www.linkedin.com/in/harsh-solanki-cse/","_blank")}}
          className='icon linkedin'><img src="/doc-icons/linkedin_v2.svg" alt="" /></div>

        <div
        ref={el => (dockRefs.current.cli = el)}
         onClick={() => handleDockClick('cli')}
          className='icon cli'><img src="/doc-icons/cli.svg" alt="" />
          {windowsState.cli && <span className="active-dot"></span>}
          </div>
    </footer>
  )
}

export default Dock