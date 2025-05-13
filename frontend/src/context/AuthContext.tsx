import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchProfile = async () => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return setUser(null);

        try {
            const res = await axios.get(
                "http://localhost:5000/api/auth/profile",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const login = async (token: string, rememberMe: any) => {
        console.log("Remember Me:", rememberMe); // Log nilai rememberMe
        console.log("Token:", token); // Log token yang diterima
        if (rememberMe) {
            console.log("Saving token to localStorage");
            localStorage.setItem("token", token); // Simpan di localStorage jika rememberMe
            sessionStorage.removeItem("token"); // Hapus token dari sessionStorage jika ada
        } else {
            console.log("Saving token to sessionStorage");
            sessionStorage.setItem("token", token); // Simpan di sessionStorage jika tidak rememberMe
            localStorage.removeItem("token"); // Hapus token dari localStorage jika ada
        }
        await fetchProfile(); // Setelah login, fetch profile user
    };

    const updateProfile = async (userData) => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        await axios.patch("http://localhost:5000/api/auth/profile", userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        await fetchProfile(); // refresh data setelah update
    };

    // Fungsi logout untuk menghapus token dan reset user
    const logout = () => {
        localStorage.removeItem("token"); // Hapus token dari localStorage
        sessionStorage.removeItem("token"); // Hapus token dari sessionStorage
        setUser(null); // Reset data user
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, fetchProfile, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
