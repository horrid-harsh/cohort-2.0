import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "../style/faceExpression.scss";
import useSong from "../../home/hooks/useSong";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const { setCurrentMood, songsByMood, handleSelectSong } = useSong();

  const [expression, setExpression] = useState("Scan to begin");
  const [isDetecting, setIsDetecting] = useState(false);
  const [wasDetected, setWasDetected] = useState(false);

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef });

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Sync expression to global mood and auto-play
  useEffect(() => {
    if (expression === "Scan to begin" || expression === "Neutral") return;

    // Mapping detected text (e.g. "Happy 😄") to state values
    let detectedMood = "";
    if (expression.includes("Happy")) detectedMood = "happy";
    else if (expression.includes("Sad")) detectedMood = "sad";
    else if (expression.includes("Surprised")) detectedMood = "surprised";

    if (detectedMood) {
      setCurrentMood(detectedMood);
      setWasDetected(true); // Flag to trigger song selection once songs are cached/loaded
    }
  }, [expression, setCurrentMood]);

  // Auto-play a random song from the detected mood once songs are available
  useEffect(() => {
    if (!wasDetected) return;

    // Mapping current expression to mood key for lookup
    let moodKey = "";
    if (expression.includes("Happy")) moodKey = "happy";
    else if (expression.includes("Sad")) moodKey = "sad";
    else if (expression.includes("Surprised")) moodKey = "surprised";

    const playlist = songsByMood[moodKey];

    // If playlist is available and has songs, pick one and reset the flag
    if (playlist && playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      handleSelectSong(playlist[randomIndex]);
      setWasDetected(false);
    }
  }, [wasDetected, songsByMood, expression, handleSelectSong]);

  const handleDetect = () => {
    setIsDetecting(true);
    detect({ landmarkerRef, videoRef, setExpression });
    // Visual feedback delay
    setTimeout(() => setIsDetecting(false), 500);
  };

  return (
    <div className="face-expression-container">
      <div className="expression-card">
        <h1 className="card-title">
          Moodify<span>.</span>
        </h1>

        <div className="video-wrapper">
          <video ref={videoRef} playsInline />
        </div>

        <div className="expression-result">
          <p className="result-label">Current Emotion</p>
          <h2 className="result-text">{expression}</h2>
        </div>

        <button
          className="detect-btn"
          onClick={handleDetect}
          disabled={isDetecting}
        >
          <span className="btn-icon">
            <i className="ri-flashlight-fill"></i>
          </span>
          {isDetecting ? " Scanning..." : " Detect expression"}
        </button>
      </div>
    </div>
  );
}
