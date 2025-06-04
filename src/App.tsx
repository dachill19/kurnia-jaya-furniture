import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

import Layout from "./components/main/layout/Layout";
import HomePage from "./pages/main/HomePage";
import AboutPage from "./pages/main/AboutPage";
import AuthPage from "./pages/main/AuthPage";
import { SidebarProvider } from "./components/ui/sidebar";
import CartPage from "./pages/main/CartPage";
import NotFound from "./pages/main/NotFound";
import CategoriesPage from "./pages/main/CategoriesPage";
import CategoryPage from "./pages/main/CategoryPage";
import ProductDetailPage from "./pages/main/ProductDetailPage";

const App = () => {
    const { initialize, isInitialized } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Tampilkan loading spinner sampai auth state terinisialisasi
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kj-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat aplikasi...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
                {/* <Route
                        path="/admin/*"
                        element={
                            <SidebarProvider>
                                <AdminLayout />
                            </SidebarProvider>
                        }
                    >
                    </Route> */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route
                        path="categories/:categoryName"
                        element={<CategoryPage />}
                    />
                    <Route
                        path="products/:productId"
                        element={<ProductDetailPage />}
                    />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
