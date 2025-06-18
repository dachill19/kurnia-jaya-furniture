import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/stores/authStore";

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { initialize, user, isInitialized } = useAuthStore();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        if (isInitialized && user) {
            if (user.role === "ADMIN") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [user, isInitialized, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        setIsRegistering(tab === "register");
    }, [location.search]);

    useEffect(() => {
        initialize();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN" && session?.user && isRegistering) {
                    setIsRegistered(true);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [initialize, isRegistering]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kj-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        );
    }

    if (isRegistered) {
        return (
            <div className="container-custom py-16 min-h-[calc(100vh-400px)]">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4 text-kj-red">
                            Cek Email Anda
                        </h1>
                        <p className="text-gray-600">
                            Kami telah mengirimkan email verifikasi ke alamat
                            yang Anda daftarkan. Silakan buka email dan klik
                            link verifikasinya untuk menyelesaikan pendaftaran.
                        </p>
                        <button
                            onClick={() => {
                                setIsRegistered(false);
                                setIsRegistering(false);
                            }}
                            className="mt-4 text-kj-red hover:underline"
                        >
                            Kembali ke Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-16 min-h-[calc(100vh-400px)]">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h1 className="text-2xl font-serif font-bold text-center mb-6">
                        {isRegistering ? "Buat Akun" : "Masuk"}
                    </h1>

                    <Tabs
                        defaultValue={isRegistering ? "register" : "login"}
                        value={isRegistering ? "register" : "login"}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger
                                value="login"
                                onClick={() => setIsRegistering(false)}
                                className="data-[state=active]:bg-kj-red data-[state=active]:text-white"
                            >
                                Masuk
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                onClick={() => setIsRegistering(true)}
                                className="data-[state=active]:bg-kj-red data-[state=active]:text-white"
                            >
                                Daftar
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>

                        <TabsContent value="register">
                            <RegisterForm
                                onRegistered={() => setIsRegistered(true)}
                            />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-4 text-center text-sm text-gray-500">
                        <Link
                            to="/forgot-password"
                            className="text-kj-red hover:underline"
                        >
                            Lupa Kata Sandi?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
