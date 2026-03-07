import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import MusicPlayer from "../components/MusicPlayer";
import UploadModal from "../components/UploadModal";
import FaceExpression from "../../Expression/components/FaceExpression";
import Navbar from "../../shared/components/Navbar";
import useSong from "../hooks/useSong";

const Home = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const dashboardRef = useRef(null);
  const {
    songsByMood,
    currentMood,
    setCurrentMood,
    loading,
    handleFetchSongs,
  } = useSong();

  useEffect(() => {
    handleFetchSongs(currentMood);
  }, [currentMood, handleFetchSongs]);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentSongs = songsByMood[currentMood] || [];

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Hero Section */}
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
            <h3>Playlist</h3>
            <div className="mood-tabs">
              {["happy", "sad", "surprised"].map((mood) => (
                <button
                  key={mood}
                  className={`mood-tab ${currentMood === mood ? "active" : ""}`}
                  onClick={() => setCurrentMood(mood)}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="song-list" key={currentMood}>
            {(loading || songsByMood[currentMood] === null) &&
            (!songsByMood[currentMood] || currentSongs.length === 0) ? (
              <div className="playlist-status">Loading songs...</div>
            ) : currentSongs && currentSongs.length > 0 ? (
              currentSongs.map((song) => (
                <div key={song._id} className="song-item">
                  <div className="song-poster">
                    {song.posterUrl ? (
                      <img src={song.posterUrl} alt={song.title} />
                    ) : (
                      <div className="song-poster-placeholder"></div>
                    )}
                  </div>
                  <div className="song-info">
                    <p className="song-title">{song.title}</p>
                    <p className="song-artist">
                      {song.artist || currentMood.toUpperCase()}
                    </p>
                  </div>
                  <div className="song-duration">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              ))
            ) : (
              <div className="playlist-status empty">
                No songs added yet. Upload a track to start building your
                playlist.
              </div>
            )}
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
