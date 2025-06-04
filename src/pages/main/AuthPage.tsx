import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/main/auth/LoginForm";
import RegisterForm from "@/components/main/auth/RegisterForm";

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

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

                    <Tabs defaultValue="login" className="w-full">
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
