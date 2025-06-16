import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import { SidebarProvider } from "./components/ui/sidebar";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import AccountPage from "./pages/AccountPage";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import AdminProductDetailPage from "./pages/admin/ProductDetailPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import CheckoutPage from "./pages/CheckoutPage";
import AddCategoryPage from "./pages/admin/AddCategoryPage"; // Import AddCategoryPage
import EditCategoryPage from "./pages/admin/EditCategoryPage"; // Import EditCategoryPage

const App = () => {
    const { initialize, isInitialized } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

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
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <SidebarProvider>
                                <AdminLayout />
                            </SidebarProvider>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="products/add" element={<AddProductPage />} />
                    <Route
                        path="products/:productId"
                        element={<AdminProductDetailPage />}
                    />
                    <Route
                        path="products/:productId/edit"
                        element={<EditProductPage />}
                    />
                    <Route
                        path="products/import"
                        element={<div>Import Products Page (TBD)</div>}
                    />
                    <Route
                        path="categories/add"
                        element={<AddCategoryPage />}
                    />
                    <Route
                        path="categories/:categoryId/edit"
                        element={<EditCategoryPage />}
                    />
                    <Route
                        path="orders"
                        element={<div>Orders Page (TBD)</div>}
                    />
                    <Route
                        path="notifications"
                        element={<div>Notifications Page (TBD)</div>}
                    />
                </Route>

                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route
                        path="categories/:categoryName"
                        element={<CategoryPage />}
                    />
                    <Route path="products" element={<ProductsPage />} />
                    <Route
                        path="products/:productId"
                        element={<ProductDetailPage />}
                    />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
