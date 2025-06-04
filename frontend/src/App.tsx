import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import AccountPage from "./pages/AccountPage";
import CategoriesPage from "./pages/CategoriesPage";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import AdminLogin from "./pages/admin/AdminLogin";
import { SidebarProvider } from "./components/ui/sidebar";
import AdminLayout from "./components/AdminLayout";
// import Dashboard from "./pages/admin/Dashboard";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const App = () => (
    <AuthProvider>
        <CartProvider>
            <BrowserRouter>
                <Toaster />
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin/*"
                        element={
                            <SidebarProvider>
                                <AdminLayout />
                            </SidebarProvider>
                        }
                    >
                        {/* <Route index element={<Dashboard />} /> */}
                    </Route>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="signin" element={<SignInPage />} />
                        <Route path="account" element={<AccountPage />} />
                        <Route
                            path="products/:productId"
                            element={<ProductDetailPage />}
                        />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route
                            path="categories/:categoryName"
                            element={<CategoryPage />}
                        />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </AuthProvider>
);

export default App;
