import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // fixed import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // seconds

            if (decoded.exp && decoded.exp < currentTime) {
                // Token expired
                localStorage.removeItem("token");
                setUser(null);
            } else {
                setUser({ ...decoded, token }); // store token with user
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};