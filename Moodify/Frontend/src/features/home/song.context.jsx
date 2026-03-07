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
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export default SongContext;
