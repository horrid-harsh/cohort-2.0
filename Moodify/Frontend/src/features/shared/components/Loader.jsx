import React from "react";
import "../style/loader.scss";

const Loader = () => {
  return (
    <div className="global-loader-container">
      <div className="loader-content">
        <div className="nebula-spinner">
          <div className="nebula-ring rings-1"></div>
          <div className="nebula-ring rings-2"></div>
          <div className="nebula-ring rings-3"></div>
          <div className="core-glow"></div>
        </div>
        <div className="loading-text">Moodify</div>
      </div>
    </div>
  );
};

export default Loader;
