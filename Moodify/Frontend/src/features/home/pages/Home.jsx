import React, { useState, useRef } from "react";
import "../style/home.scss";
import MusicPlayer from "../components/MusicPlayer";
import UploadModal from "../components/UploadModal";
import FaceExpression from "../../Expression/components/FaceExpression";
import Navbar from "../../shared/components/Navbar";

const Home = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const dashboardRef = useRef(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Hero Section / Landing Page */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Moodify<span>.</span>
          </h1>
          <h2 className="hero-subtitle">Music for Your Mood</h2>
          <button className="pearl-button" onClick={scrollToDashboard}>
            <div className="wrap">
              <p>
                <span>✧</span>
                <span>✦</span>
                Get Started
              </p>
            </div>
          </button>
        </div>

        {/* Animated Background Element (Optional, to match the wave in mockup) */}
        <div className="hero-wave"></div>
      </section>

      {/* Dashboard Section */}
      <div className="home-container" ref={dashboardRef}>
        {/* Left Section (Now simpler as logo moved to navbar) */}
        <section className="intro-section">
          <h2 className="section-title">
            Your Emotional <span>Sync.</span>
          </h2>
          <p className="description">
            Experience music like never before. Detect your emotions using AI
            and let us find the perfect soundtrack for your current state of
            mind.
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
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default Home;
