import { Rnd } from "react-rnd";
import "./window.scss";
import { useState } from "react";

const MacWindow = ({ children, width='40vw', height='60vh', windowName, setWindowsState  }) => {

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

const [{ x, y }] = useState(getRandomPosition);

  return (
    <Rnd 
        default={{
            width: width,
            height: height,
            x: x,
            y: y
        }}

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

            <div className="dot yellow">
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
            
            <div className="dot green">
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
