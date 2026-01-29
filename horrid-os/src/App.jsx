import "./app.scss";
import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import MacWindow from "./components/windows/MacWindow";
import GitHub from "./components/windows/GitHub";
import Note from "./components/windows/Note";
import Resume from "./components/windows/Resume";
import Spotify from "./components/windows/Spotify";
import Cli from "./components/windows/Cli";
import { useState } from "react";
import DesktopContextMenu from "./components/DesktopContextMenu";
import BootScreen from "./components/BootScreen";

function App() {

  const [booting, setBooting] = useState(true);

  const [desktopMenuPos, setDesktopMenuPos] = useState(null);

  const [windowsState, setWindowsState] = useState({
    github: false,
    note: false,
    resume: false,
    spotify: false,
    cli: false,
  });

  const [minimizedWindows, setMinimizedWindows] = useState({
    github: false,
    note: false,
    resume: false,
    spotify: false,
    cli: false,
  });

  const [topZIndex, setTopZIndex] = useState(1);

  const windowsConfig = [
    { key: "github", component: GitHub },
    { key: "note", component: Note },
    { key: "resume", component: Resume },
    { key: "spotify", component: Spotify },
    { key: "cli", component: Cli },
  ];

  const windowProps = {
    setWindowsState,
    topZIndex,
    setTopZIndex,
    minimizedWindows,
    setMinimizedWindows,
  };

  const handleDesktopContextMenu = (e) => {
  // only right click
  e.preventDefault();

  // ignore right-clicks on windows or dock
  if (e.target.closest(".mac-window-rnd") || e.target.closest(".dock")) {
    return;
  }

  setDesktopMenuPos({
    x: e.clientX,
    y: e.clientY,
  });
};
const closeDesktopMenu = () => {
  setDesktopMenuPos(null);
};

return (
<>
  {/* {booting && <BootScreen onFinish={() => setBooting(false)} />} */}

  <main className={booting ? "app-hidden" : ""}>
    <Navbar />
    <div id="desktop">
      <Dock
        windowsState={windowsState}
        setWindowsState={setWindowsState}
        setMinimizedWindows={setMinimizedWindows}
      />

      {windowsConfig.map(({ key, component: WindowComponent }) =>
        windowsState[key] ? (
          <WindowComponent
            key={key}
            windowName={key}
            windowProps={windowProps}
          />
        ) : null
      )}
    </div>
  </main>
</>
)
    
  


  // return (
  //   <>
  //     <main onClick={closeDesktopMenu} onContextMenu={handleDesktopContextMenu}>
  //       <Navbar />
  //       <div id="desktop">
  //         <Dock
  //           windowsState={windowsState}
  //           setWindowsState={setWindowsState}
  //           setMinimizedWindows={setMinimizedWindows}
  //         />

  //         {windowsConfig.map(({ key, component: WindowComponent }) => {
  //           console.log(key, windowsState[key]); // debugging is fine here

  //           return windowsState[key] ? (
  //             <WindowComponent
  //               key={key}
  //               windowName={key}
  //               windowProps={windowProps}
  //             />
  //           ) : null;
  //         })}
  //       </div>
  //       <DesktopContextMenu position={desktopMenuPos} onClose={closeDesktopMenu} />
  //     </main>
  //   </>
  // );
}

export default App;
