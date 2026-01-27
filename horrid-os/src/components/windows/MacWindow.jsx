import { Rnd } from "react-rnd";
import "./window.scss";
import { useEffect, useState } from "react";
import { useRef } from "react";

const MacWindow = ({ children, width='40vw', height='60vh', windowName, windowProps }) => {

  const {
    setWindowsState,
    topZIndex,
    setTopZIndex,
    minimizedWindows,
    setMinimizedWindows
  } = windowProps;

  const vwToPx = (vw) => (window.innerWidth * parseFloat(vw)) / 100;
  const vhToPx = (vh) => (window.innerHeight * parseFloat(vh)) / 100;

  const getRandomPosition = () => {
  const windowWidthPx =
    typeof width === 'string' ? vwToPx(width) : width;

  const windowHeightPx =
    typeof height === 'string' ? vhToPx(height) : height;

  const minX = 80;
  const minY = 80;

  const maxX = window.innerWidth - windowWidthPx - 80;
  const maxY = window.innerHeight - windowHeightPx - 120;

  return {
    x: Math.floor(Math.random() * (maxX - minX)) + minX,
    y: Math.floor(Math.random() * (maxY - minY)) + minY
  };
};

const toggleMaximize = () => {
  if (!isMaximized) {
    rndRef.current.updatePosition({ x: 0, y: 0 });
    rndRef.current.updateSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  } else {
    rndRef.current.updateSize({
      width,
      height
    });
    rndRef.current.updatePosition({ x, y });
  }

  setIsMaximized(prev => !prev);
};

const rndRef = useRef(null);
const [{ x, y }] = useState(getRandomPosition);
const [zIndex, setZIndex] = useState(1);
const [isMaximized, setIsMaximized] = useState(false);
const [isInteracting, setIsInteracting] = useState(false);

const [size, setSize] = useState({
  width,
  height
});

const [position, setPosition] = useState({ x, y });

const bringToFront = () => {
  setTopZIndex(prev => {
    const next = prev + 1;
    setZIndex(next);
    return next;
  });
};

useEffect(() => {
  bringToFront();
}, []);

// useEffect(() => {
//   if (!minimizedWindows[windowName]) {
//     bringToFront();
//   }
// }, [minimizedWindows[windowName]]);


  return (
    <Rnd 
      ref={rndRef}
      className="mac-window-rnd"
      default={{
        width,
        height,
        x,
        y
      }}
      minWidth={320}
      minHeight={220}
      enableResizing={!isMaximized}
      onDragStart={() => setIsInteracting(true)}
      onDragStop={(e, d) => {
        setIsInteracting(false);
        // Enforce top boundary - window cannot go above y = 0 (like macOS)
        const constrainedY = Math.max(0, d.y);
        const finalPosition = { x: d.x, y: constrainedY };

        // Update the position if it was constrained
        if (constrainedY !== d.y) {
          rndRef.current.updatePosition({ x: d.x, y: constrainedY });
        }

        setPosition(finalPosition);
      }}
      onResizeStart={() => setIsInteracting(true)}
      onResizeStop={(e, dir, ref, delta, pos) => {
        setIsInteracting(false);
        setSize({
          width: ref.style.width,
          height: ref.style.height
        });
        setPosition(pos);
      }}
      style={{
        display: minimizedWindows[windowName] ? 'none' : 'block',
        zIndex,
        transition: isInteracting
          ? 'none'
          : 'width 0.28s cubic-bezier(0.4,0,0.2,1), height 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)'
      }}
      onMouseDown={bringToFront}
      dragHandleClassName="window-drag-handle"
    >
      <div className="window">
        <div className="nav window-drag-handle">
          <div className="dots">
            <div 
              onClick={()=> setWindowsState(state => ({ ...state, [windowName]: false }))}
              className="dot red">
              {/* Close */}
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path
                  d="M1.182 5.99L5.99 1.182M5.99 5.99L1.182 1.182"
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div onClick={()=> 
              setMinimizedWindows(state => ({
              ...state, [windowName]: true
            }))} 
            className="dot yellow">
              <svg
                width="7"
                height="7"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.2 3.5H5.8"
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <div onClick={toggleMaximize} className="dot green">
              <svg
                viewBox="0 0 13 13"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
              >
                <path d="M4.871 3.553L9.37 8.098V3.553H4.871zm3.134 5.769L3.506 4.777v4.545h4.499z" />
                <circle cx={6.438} cy={6.438} r={6.438} fill="none" />
              </svg>
            </div>
          </div>
          <div className="title">
            <p>blackmyth - zsh</p>
          </div>
        </div>
        <div className="main-content">
            {children}
        </div>
      </div>
    </Rnd>
  );
};

export default MacWindow;
