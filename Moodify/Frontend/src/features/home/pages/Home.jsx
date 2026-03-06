import React, { useState, useRef } from "react";
import "../style/home.scss";
import MusicPlayer from "../components/MusicPlayer";
import UploadModal from "../components/UploadModal";
import FaceExpression from "../../Expression/components/FaceExpression";
import Navbar from "../../shared/components/Navbar";
import song1 from "../../../assets/song1.png";
import song2 from "../../../assets/song2.jpg";
import song3 from "../../../assets/song3.png";
import song4 from "../../../assets/song4.png";
import song5 from "../../../assets/song5.jpg";

const Home = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const dashboardRef = useRef(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const songs = [
    {
      id: 1,
      title: "I Love You, I'm Sorry",
      artist: "Gracie Abrams",
      img: song1,
    },
    { id: 2, title: "FUNK OPTICA", artist: "ICEDMANE, DYSMANE", img: song2 },
    { id: 3, title: "Bad Boy", artist: "Raaban", img: song3 },
    { id: 4, title: "Snap", artist: "Rosa Linn", img: song4 },
    { id: 5, title: "Royalty", artist: "Egzod", img: song5 },
  ];

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Hero Section / Landing Page */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">✧ Personalization Redefined</p>
          <h2 className="hero-subtitle">
            Your Emotions, <br className="mobile-break" />
            Our Soundtrack
          </h2>
          <p className="hero-description">
            Moodify uses intelligent facial expression analysis to understand
            your emotional state and curate a personalized music experience that
            syncs with how you feel.
          </p>

          <div className="hero-actions">
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

          <div className="hero-features">
            <div className="feature">
              <i className="ri-shield-flash-line"></i>
              <span>Expression Analysis</span>
            </div>
            <div className="feature">
              <i className="ri-pulse-line"></i>
              <span>Real-time Sync</span>
            </div>
            <div className="feature">
              <i className="ri-headphone-line"></i>
              <span>Smart Playlists</span>
            </div>
          </div>
        </div>

        {/* Animated Background Element */}
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
            {songs.map((song) => (
              <div key={song.id} className="song-item">
                <div className="song-poster">
                  {song.img ? (
                    <img src={song.img} alt={song.title} />
                  ) : (
                    <div className="song-poster-placeholder"></div>
                  )}
                </div>
                <div className="song-info">
                  <p className="song-title">{song.title}</p>
                  <p className="song-artist">{song.artist}</p>
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
