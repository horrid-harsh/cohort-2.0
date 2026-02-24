import React from "react";

/**
 * GlobalSvgDefs
 *
 * This component contains SVG definitions (gradients, filters, masks, etc.)
 * that need to be globally accessible across the application.
 * It is rendered once at the root to avoid re-definition overhead.
 */
const GlobalSvgDefs = () => {
  return (
    <svg
      width="0"
      height="0"
      style={{
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Instagram-style Heart Gradient */}
        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="40%" stopColor="#FF0069" />
          <stop offset="100%" stopColor="#D300C5" />
        </linearGradient>

        {/* You can add more global definitions here as the app grows (e.g., filters, other gradients) */}
      </defs>
    </svg>
  );
};

export default GlobalSvgDefs;
