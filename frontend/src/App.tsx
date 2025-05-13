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

const App = () => (
    <AuthProvider>
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="signin" element={<SignInPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route
                            path="categories/:categoryName"
                            element={<CategoryPage />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </AuthProvider>
);

export default App;
