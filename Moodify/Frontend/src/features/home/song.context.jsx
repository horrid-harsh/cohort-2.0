import { createContext, useState } from "react";

const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(false);
    
    return (
        <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
            {children}
        </SongContext.Provider>
    );
};

export default SongContext;