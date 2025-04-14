import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";

import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";

const App = () => (
    <LanguageProvider>
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="about" element={<AboutPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </LanguageProvider>
);

export default App;
