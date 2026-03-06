import React, { useState } from "react";
import "../style/player.scss";
import posterImg from "../../../assets/poster_billie.png";

const MusicPlayer = () => {
  const [volume, setVolume] = useState(80);

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  return (
    <div className="music-player">
      <div className="poster-container">
        <img src={posterImg} alt="Album Poster" className="poster" />
      </div>

      <div className="details">
        <div className="info">
          <h4>Happier Than Ever</h4>
          <p>Billie Eilish</p>
        </div>

        <div className="controls">
          <button className="prev">
            <i className="ri-skip-back-fill"></i>
          </button>
          <button className="play-pause">
            <i className="ri-play-large-fill"></i>
          </button>
          <button className="next">
            <i className="ri-skip-forward-fill"></i>
          </button>
        </div>
      </div>

      <div className="volume-control">
        <i className="ri-volume-up-line"></i>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          style={{ "--val": `${volume}%` }}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
