import { useState, useContext } from "react";
import { registerApi } from "../services/auth.api";
import AuthContext from "../auth.context";

const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading, error, setError } = context;

    const registerUser = async (userData) => {
        setLoading(true);
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