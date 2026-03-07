import { createContext, useState } from "react";

const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [songsByMood, setSongsByMood] = useState({
    happy: null,
    sad: null,
    surprised: null,
  });
  const [currentMood, setCurrentMood] = useState("happy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SongContext.Provider
      value={{
        songsByMood,
        setSongsByMood,
        currentMood,
        setCurrentMood,
        loading,
        setLoading,
        error,
        setError,
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export default SongContext;
