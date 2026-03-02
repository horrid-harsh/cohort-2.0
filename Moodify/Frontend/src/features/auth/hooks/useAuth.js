import { useState } from "react";
import { registerApi } from "../services/auth.api";

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const registerUser = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerApi(userData);
            console.log("Response from registerApi(useAuth.js) : ", response);
            setUser(response.user);
            return response;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        user,
        registerUser
    };
};

export default useAuth;