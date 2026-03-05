import React, { useState } from "react";
import "../style/upload.scss";
import SubmitButton from "../../auth/components/SubmitButton";

const UploadModal = ({ isOpen, onClose }) => {
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState("Happy");

  if (!isOpen) return null;

  const moods = ["Happy", "Sad", "Surprised"];

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Upload Music</h2>
        <form className="upload-form">
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Song Title</label>
            <input type="text" placeholder="Enter song title" />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Artist</label>
            <input type="text" placeholder="Enter artist name" />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Mood</label>
            <div className={`custom-dropdown ${isMoodOpen ? "active" : ""}`}>
              <div
                className="dropdown-selected"
                onClick={() => setIsMoodOpen(!isMoodOpen)}
              >
                <span>{selectedMood}</span>
                <i className={`chevron ${isMoodOpen ? "up" : "down"}`}></i>
              </div>

              {isMoodOpen && (
                <div className="dropdown-options">
                  {moods.map((mood) => (
                    <div
                      key={mood}
                      className={`option ${selectedMood === mood ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedMood(mood);
                        setIsMoodOpen(false);
                      }}
                    >
                      {mood}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <div className="file-input-wrapper">
              <p>Drag and drop your audio file or click to browse</p>
              <input type="file" style={{ display: "none" }} />
            </div>
          </div>

          <SubmitButton label="Upload Song" loading={false} />
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
