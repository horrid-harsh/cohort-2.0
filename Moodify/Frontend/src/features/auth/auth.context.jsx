import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;