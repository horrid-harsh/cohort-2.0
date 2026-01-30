import { useEffect, useRef, useState } from "react";
import "./BootScreen.scss";
import AppleIcon from "../../public/nav-icons/apple.svg";

export default function BootScreen({ onFinish }) {
  const progressRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let start = null;
    const DURATION = 3200; // progress fill time

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      console.log("timestamp", timestamp);

      const elapsed = timestamp - start;

      // ease-out curve for macOS-like feel
      const t = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      const progress = eased * 100;

      progressRef.current.style.width = `${progress}%`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // tiny pause at end (macOS-style)
        setTimeout(() => {
          setFadeOut(true);

          // wait for fade animation to finish
          setTimeout(onFinish, 400);
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [onFinish]);

  return (
    <div className={`boot-screen ${fadeOut ? "fade-out" : ""}`}>
      <img onContextMenu={(e) => e.preventDefault()} src={AppleIcon} alt="Apple" className="boot-logo" />
      <div className="boot-progress">
        <div ref={progressRef} className="boot-progress-fill" />
      </div>
    </div>
  );
}
