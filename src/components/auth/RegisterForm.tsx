import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { translateSupabaseError } from "@/lib/utils";

const RegisterForm = ({ onRegistered }: { onRegistered?: () => void }) => {
    const { register, loginWithGoogle } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const isLoading =
        isLoadingKey("auth-register") || isLoadingKey("auth-google");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!agreeTerms) {
            setErrorMsg("Anda harus menyetujui syarat dan ketentuan.");
            return;
        }

        try {
            await register(email, password, name, phone);
            onRegistered?.();
        } catch (error: any) {
            const errorMessage = translateSupabaseError(error?.message);
            setErrorMsg(errorMessage);
        }
    };

    const handleGoogleRegister = async () => {
        setErrorMsg("");
        try {
            await loginWithGoogle();
            onRegistered?.();
        } catch (error: any) {
            const errorMessage = translateSupabaseError(error?.message);
            setErrorMsg(errorMessage);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <div className="flex border border-gray-300 rounded-md">
                        <div className="flex items-center px-3 border-r border-gray-300">
                            <User size={20} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="flex-1 p-2 focus:outline-none"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex border border-gray-300 rounded-md">
                        <div className="flex items-center px-3 border-r border-gray-300">
                            <Mail size={20} className="text-gray-500" />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
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
                            <Phone size={20} className="text-gray-500" />
                        </div>
                        <input
                            type="tel"
                            placeholder="Nomor Telepon"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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

                <div className="mb-6">
                    <div className="flex items-center">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={() => setAgreeTerms(!agreeTerms)}
                            className="h-4 w-4 border-gray-300 rounded text-kj-red focus:ring-kj-red"
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="terms"
                            className="ml-2 text-sm text-gray-600"
                        >
                            Saya setuju dengan{" "}
                            <Link
                                to="/terms"
                                className="text-kj-red hover:underline"
                            >
                                syarat dan ketentuan
                            </Link>
                        </label>
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
                    {isLoading ? "Memproses..." : "Daftar"}
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
                    onClick={handleGoogleRegister}
                    disabled={isLoading}
                >
                    Google
                </Button>
            </div>
        </>
    );
};

export default RegisterForm;
