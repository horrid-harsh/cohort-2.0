import React, { useState, useRef } from "react";
import "../style/upload.scss";
import SubmitButton from "../../auth/components/SubmitButton";
import useSong from "../hooks/useSong";

const UploadModal = ({ isOpen, onClose }) => {
  const { handleUploadSong, loading } = useSong();
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const moods = ["Happy", "Sad", "Surprised"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file first.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("song", file);
    formData.append("mood", selectedMood.toLowerCase());

    const result = await handleUploadSong(formData);

    if (result.success) {
      setFile(null);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Music</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="upload-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

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
            <div
              className={`file-input-wrapper ${file ? "has-file" : ""}`}
              onClick={() => fileInputRef.current.click()}
            >
              <p>
                {file
                  ? `Selected: ${file.name}`
                  : "Drag and drop your audio file or click to browse"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="audio/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <SubmitButton label="Upload Song" loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
