import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/auth/login",
                {
                    email,
                    password,
                }
            );

            const token = response.data.token;
            await login(token, false);

            navigate("/admin/dashboard");
        } catch (error) {
            if (error.response?.data?.error) {
                setErrorMsg(error.response.data.error);
            } else {
                setErrorMsg("Login gagal. Coba lagi nanti.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-kj-red">
                        Admin Dashboard
                    </h1>
                </div>

                <Card className="border-none shadow-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">Login Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <div className="flex border border-gray-300 rounded-md mb-2">
                                    <div className="flex items-center px-3 border-r border-gray-300">
                                        <Mail
                                            size={20}
                                            className="text-gray-500"
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Alamat Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        className="flex-1 p-2 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex border border-gray-300 rounded-md">
                                    <div className="flex items-center px-3 border-r border-gray-300">
                                        <Lock
                                            size={20}
                                            className="text-gray-500"
                                        />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Kata Sandi"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        className="flex-1 p-2 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 text-gray-500"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="mb-4 text-sm text-red-600 text-center">
                                    {errorMsg}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-kj-red hover:bg-kj-darkred mb-4"
                            >
                                Masuk
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;
