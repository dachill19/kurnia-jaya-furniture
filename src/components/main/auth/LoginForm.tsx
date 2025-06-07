import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { translateSupabaseError } from "@/lib/utils";
import { useLoadingStore } from "@/stores/loadingStore";

const LoginForm = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const isLoading = isLoadingKey("auth-login") || isLoadingKey("auth-google");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            await login(email, password);
            navigate("/");
        } catch (error: any) {
            const errorMessage = translateSupabaseError(error?.message);
            setErrorMsg(errorMessage);
        }
    };

    const handleGoogleLogin = async () => {
        setErrorMsg("");
        try {
            await loginWithGoogle();
            navigate("/");
        } catch (error: any) {
            const errorMessage = translateSupabaseError(error?.message);
            setErrorMsg(errorMessage);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <div className="flex border border-gray-300 rounded-md mb-2">
                        <div className="flex items-center px-3 border-r border-gray-300">
                            <Mail size={20} className="text-gray-500" />
                        </div>
                        <input
                            type="email"
                            placeholder="Alamat Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 p-2 focus:outline-none"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex border border-gray-300 rounded-md">
                        <div className="flex items-center px-3 border-r border-gray-300">
                            <Lock size={20} className="text-gray-500" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Kata Sandi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex-1 p-2 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="px-3 text-gray-500"
                            onClick={togglePasswordVisibility}
                            disabled={isLoading}
                            tabIndex={-1}
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
                    className="w-full bg-kj-red hover:bg-kj-darkred"
                    disabled={isLoading}
                >
                    {isLoading ? "Memproses..." : "Masuk"}
                </Button>
            </form>

            <div className="relative flex items-center justify-center my-6">
                <hr className="absolute w-full border-t border-gray-300" />
                <span className="relative px-2 bg-white text-sm text-gray-500">
                    Atau lanjutkan dengan
                </span>
            </div>

            <div className="flex mb-6">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    Google
                </Button>
            </div>
        </>
    );
};

export default LoginForm;
