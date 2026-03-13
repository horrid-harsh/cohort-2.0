import { useState, useEffect } from "react";

/**
 * Custom hook that tracks the state of a media query.
 * @param {string} query - The media query to track (e.g., "(max-width: 768px)")
 * @returns {boolean} - True if the media query matches, false otherwise.
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Define listener function
    const listener = (e) => {
      setMatches(e.matches);
    };

    // Use modern addEventListener if available, fallback to addListener
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]); // Re-run if query changes

  return matches;
};

export default useMediaQuery;
