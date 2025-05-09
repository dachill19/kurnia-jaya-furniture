import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const SignInPage = () => {
    const { t } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            const token = response.data.token;

            await login(token, rememberMe);
            navigate("/");
        } catch (error) {
            if (error.response?.data?.error) {
                // Pemetaan pesan error backend ke dalam bahasa yang dipilih
                const errorKey = error.response.data.error;

                if (errorKey === "Email tidak ditemukan.") {
                    setErrorMsg(t("emailNotFound"));
                } else if (errorKey === "Password salah.") {
                    setErrorMsg(t("invalidPassword"));
                } else {
                    setErrorMsg(t("loginFailed"));
                }
            } else {
                setErrorMsg(t("loginFailed"));
            }
        }
    };

    return (
        <div className="container-custom py-16 min-h-[calc(100vh-400px)]">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h1 className="text-2xl font-serif font-bold text-center mb-6">
                        {isRegistering ? t("createAccount") : t("signIn")}
                    </h1>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger
                                value="login"
                                onClick={() => setIsRegistering(false)}
                                className="data-[state=active]:bg-kj-red data-[state=active]:text-white"
                            >
                                {t("signIn")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                onClick={() => setIsRegistering(true)}
                                className="data-[state=active]:bg-kj-red data-[state=active]:text-white"
                            >
                                {t("register")}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleSubmit}>
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
                                            placeholder={t("email")}
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
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder={t("password")}
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

                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(e.target.checked)
                                            }
                                            className="h-4 w-4 border-gray-300 rounded text-kj-red focus:ring-kj-red"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="ml-2 text-sm text-gray-600"
                                        >
                                            {t("rememberMe")}
                                        </label>
                                    </div>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-kj-red hover:underline"
                                    >
                                        {t("forgotPassword")}
                                    </Link>
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
                                    {t("signIn")}
                                </Button>
                            </form>

                            <div className="relative flex items-center justify-center my-6">
                                <Separator className="absolute w-full" />
                                <span className="relative px-2 bg-white text-sm text-gray-500">
                                    {t("orContinueWith")}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Button variant="outline" className="w-full">
                                    Google
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Facebook
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
