import { useContext, useCallback } from "react";
import SongContext from "../song.context";
import {
  getSongsApi,
  uploadSongApi,
  deleteSongApi,
} from "../services/song.api";

const useSong = () => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error("useSong must be used within a SongContextProvider");
  }

  const {
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
  } = context;

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleFetchSongs = useCallback(
    async (mood, force = false) => {
      // Avoid redundant API calls if songs are already cached (even if empty)
      if (!force && songsByMood[mood] !== null) {
        return;
      }

      setLoading(true);
      try {
        const response = await getSongsApi(mood);
        setSongsByMood((prev) => ({
          ...prev,
          [mood]: response.songs || [],
        }));
      } catch (err) {
        console.error(`Error fetching ${mood} songs:`, err);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSongsByMood, songsByMood],
  );

  const handleUploadSong = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await uploadSongApi(formData);

      if (response.success) {
        // Refresh the playlist for the uploaded mood
        await handleFetchSongs(response.song.mood, true);
        return { success: true };
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Upload failed. Please try again.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      const response = await deleteSongApi(id);
      if (response.success) {
        // If the song being deleted is the one playing, reset player
        if (currentSong?._id === id) {
          setCurrentSong(null);
          setIsPlaying(false);
        }
        // Refresh the current mood's playlist
        await handleFetchSongs(currentMood, true);
        return { success: true };
      }
    } catch (err) {
      console.error("Error deleting song:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    songsByMood,
    currentMood,
    setCurrentMood,
    loading,
    error,
    currentSong,
    isPlaying,
    handleFetchSongs,
    handleUploadSong,
    handleSelectSong,
    handleDeleteSong,
    togglePlayPause,
    setIsPlaying,
  };
};

export default useSong;
