import { getSongApi } from "../../auth/song.api";
import { useContext, useCallback } from "react";
import SongContext from "../song.context";

const useSong = () => {
    const context = useContext(SongContext);
    const { song, setSong, loading, setLoading } = context;

    const handleGetSong = useCallback(async ({ mood }) => {
        setLoading(true);
        try {
            const response = await getSongApi({ mood });
            setSong(response.song);
        } catch (error) {
            console.error("Error fetching song:", error);           
        } finally {
            setLoading(false);
        }
    }, []);

    return { song, loading, handleGetSong };
};

export default useSong;