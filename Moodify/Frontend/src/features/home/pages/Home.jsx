import React, { useState } from "react";
import "../style/home.scss";
import MusicPlayer from "../components/MusicPlayer";
import UploadModal from "../components/UploadModal";
import FaceExpression from "../../Expression/components/FaceExpression";
import logo from "../../../assets/logo_cropped.png";

const Home = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="home-container">
      {/* Left Section */}
      <section className="intro-section">
        <div className="logo-container">
          <img src={logo} alt="Moodify Logo" className="logo" />
        </div>
        <h1 className="title">
          Moodify<span>.</span> <br />
          Music for <br />
          Your Mood
        </h1>
        <p className="description">
          Experience music like never before. Detect your emotions using AI and
          let us find the perfect soundtrack for your current state of mind.
        </p>
      </section>

      {/* Center Section */}
      <section className="main-interaction">
        <div className="detector-view glass-card">
          <FaceExpression />
        </div>

        <MusicPlayer />
      </section>

      {/* Right Section */}
      <section className="playlist-section glass-card">
        <div className="section-header">
          <h3>Happy Playlist</h3>
        </div>

        <div className="song-list">
          {/* Placeholder songs */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="song-item">
              <div className="song-poster-placeholder"></div>
              <div className="song-info">
                <p className="song-title">Song Title {i}</p>
                <p className="song-artist">Artist Name</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="upload-action-btn"
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload a song
        </button>
      </section>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default Home;
