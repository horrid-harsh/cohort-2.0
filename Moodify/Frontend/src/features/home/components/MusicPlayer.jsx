import React from "react";
import "../style/player.scss";

const MusicPlayer = () => {
  return (
    <div className="music-player">
      <div className="poster-container">
        <div className="poster" style={{ background: "#222" }}></div>
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
        <input type="range" min="0" max="100" defaultValue="80" />
      </div>
    </div>
  );
};

export default MusicPlayer;
