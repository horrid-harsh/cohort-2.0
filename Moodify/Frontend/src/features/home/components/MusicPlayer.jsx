import React, { useState, useRef, useEffect, useCallback } from "react";
import "../style/player.scss";
import useSong from "../hooks/useSong";

const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlayPause, setIsPlaying } = useSong();
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // Sync Audio Playback with isPlaying state
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.log("Playback error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Handle Song Change
  useEffect(() => {
    if (currentSong && audioRef.current) {
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSkip = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        duration,
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
      if (newMuteState) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = volume / 100;
      }
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`music-player ${!currentSong ? "disabled" : ""}`}>
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="poster-container">
        {currentSong?.posterUrl ? (
          <img
            src={currentSong.posterUrl}
            alt={currentSong.title}
            className="poster"
          />
        ) : (
          <div className="poster-placeholder">
            <i className="ri-music-2-fill"></i>
          </div>
        )}
      </div>

      <div className="details">
        <div className="playback-container">
          <div className="info">
            <h4>{currentSong?.title || "Select a song"}</h4>
            <p>{currentSong?.artist || "Moodify Player"}</p>
          </div>

          <div className="progress-area">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="progress-bar"
              style={{
                "--progress": `${(currentTime / (duration || 1)) * 100}%`,
              }}
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="controls">
          <button className="skip-btn" onClick={() => handleSkip(-5)}>
            <i className="ri-replay-5-line"></i>
          </button>
          <button className="play-pause" onClick={togglePlayPause}>
            <i
              className={
                isPlaying ? "ri-pause-large-fill" : "ri-play-large-fill"
              }
            ></i>
          </button>
          <button className="skip-btn" onClick={() => handleSkip(5)}>
            <i className="ri-forward-5-line"></i>
          </button>
        </div>
      </div>

      <div className="volume-control">
        <button className="mute-btn" onClick={toggleMute}>
          <i
            className={isMuted ? "ri-volume-mute-line" : "ri-volume-up-line"}
          ></i>
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          style={{ "--val": `${isMuted ? 0 : volume}%` }}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
