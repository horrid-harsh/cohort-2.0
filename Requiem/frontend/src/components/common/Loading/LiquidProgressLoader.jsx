import React, { useEffect, useState } from "react";
import "./LiquidProgressLoader.scss";

const LiquidProgressLoader = ({ isAppReady = true, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isReactReady, setIsReactReady] = useState(false);
  const progressRef = React.useRef(0);

  // 1. Handover logic abolished - we now just wait for React to mount
  useEffect(() => {
    setIsReactReady(true);
    // 🔹 Disable background scrollbar during loading
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    
    return () => {
      // 🔹 Re-enable it when the loader is unmounts
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // 🔹 Smooth progress (NO stutter)
  useEffect(() => {
    if (!isReactReady) return;

    let raf;

    const animate = () => {
      const target = isAppReady ? 100 : 80;

      progressRef.current += (target - progressRef.current) * 0.025; // Slower, smoother progress

      if (progressRef.current > 99.9) progressRef.current = 100;

      setProgress(progressRef.current);

      if (progressRef.current < 100) {
        raf = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => onComplete?.(), 2500);
        }, 100);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isReactReady, isAppReady, onComplete]);

  const safeProgress = Math.min(progress, 100);
  const isFull = safeProgress > 99.5;

  return (
    <div className={`liquid-loader-container ${isExiting ? "exit" : ""}`}>
      <div className="liquid-loader-content">
        <svg viewBox="0 0 400 100" className="liquid-svg">
          <defs>
            <clipPath id="text-clip">
              <text
                x="50%"
                y="50%"
                dy=".35em"
                textAnchor="middle"
                className="liquid-text"
              >
                REQUIEM
              </text>
            </clipPath>
          </defs>

          {/* Background text */}
          <text
            x="50%"
            y="50%"
            dy=".35em"
            textAnchor="middle"
            className="liquid-text-bg"
          >
            REQUIEM
          </text>

          {/* Liquid */}
          <g clipPath="url(#text-clip)">
            {/* The y position controls the fill level (0 to 100) */}
            <g transform={`translate(0, ${100 - (safeProgress / 100) * 100})`}>
              <path
                d={isFull ? "M0 0 H800 V100 H0 Z" : `M0 15 Q 50 0 100 15 T 200 15 T 300 15 T 400 15 T 500 15 T 600 15 T 700 15 T 800 15 V 100 H 0 Z`}
                className={`wave ${isFull ? "stop" : ""}`}
                fill="#fff"
              />
            </g>
          </g>
        </svg>

        <div className="progress-percentage">
          loading... {Math.round(safeProgress)}%
        </div>
      </div>
    </div>
  );
};

export default LiquidProgressLoader;