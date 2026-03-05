import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "../style/faceExpression.scss";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Scan to begin");
  const [isDetecting, setIsDetecting] = useState(false);

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
