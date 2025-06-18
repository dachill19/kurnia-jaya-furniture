import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useLoadingStore } from "@/stores/loadingStore";
import logo from "@/assets/logo.png";
import {
    ShoppingCart,
    Menu,
    X,
    User,
    Phone,
    Mail,
    Loader2,
    Home,
    Grid3X3,
    Package,
    Info,
    ChevronDown,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useProductStore } from "@/stores/productStore";

const Header = () => {
    const { totalItems, fetchCart } = useCartStore();
    const { user, fetchProfile } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { categories, getCategories } = useProductStore();
    const navigate = useNavigate();
    const location = useLocation();

    const isCartLoading = isLoadingKey("cart-fetch");
    const isAuthLoading =
        isLoadingKey("fetch-profile") || isLoadingKey("auth-initialize");

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActive = (path) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    useEffect(() => {
        fetchProfile();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                await fetchProfile();
            } else if (event === "SIGNED_OUT") {
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    return (
        <header className="bg-white shadow-md relative">
            <div className="bg-gradient-to-r from-kj-brown to-kj-red text-white py-3">
                <div className="container-custom items-center hidden md:flex space-x-6 text-sm">
                    <a
                        href="https://wa.me/6282298528428"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-white/80 transition-colors duration-200"
                    >
                        <Phone className="h-4 w-4 mr-2" />
                        <span>+62 822-9852-8428</span>
                    </a>
                    <a
                        href="mailto:kurniajaya.furniture888@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-white/80 transition-colors duration-200"
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        <span>kurniajaya.furniture888@gmail.com</span>
                    </a>
                </div>
            </div>

            <div className="container-custom py-5">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center group">
                        <img
                            src={logo}
                            alt="Kurnia Jaya Furniture"
                            className="h-16 md:h-20 w-auto transition-transform duration-200 group-hover:scale-105"
                        />
                    </Link>

                    <nav className="hidden md:flex justify-center items-center">
                        <ul className="flex space-x-12">
                            <li>
                                <Link
                                    to="/"
                                    className={`flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                        isActive("/")
                                            ? "text-kj-red scale-105"
                                            : "hover:text-kj-red hover:scale-105"
                                    }`}
                                >
                                    <Home
                                        className={`h-5 w-5 transition-all duration-300 ${
                                            isActive("/")
                                                ? "text-kj-red"
                                                : "group-hover:text-kj-red"
                                        }`}
                                    />
                                    <span>Beranda</span>
                                    {isActive("/") && (
                                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kj-red animate-pulse"></div>
                                    )}
                                </Link>
                            </li>
                            <li className="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        className={`flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                            isActive("/categories")
                                                ? "text-kj-red scale-105"
                                                : "hover:text-kj-red hover:scale-105"
                                        }`}
                                    >
                                        <Grid3X3
                                            className={`h-5 w-5 transition-all duration-300 ${
                                                isActive("/categories")
                                                    ? "text-kj-red"
                                                    : "group-hover:text-kj-red"
                                            }`}
                                        />
                                        <span>Kategori</span>
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white shadow-lg border animate-in slide-in-from-top-2 duration-200">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <DropdownMenuItem
                                                    asChild
                                                    key={category.id}
                                                >
                                                    <Link
                                                        to={`/categories/${encodeURIComponent(
                                                            category.name
                                                        )}`}
                                                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 px-3 py-2"
                                                    >
                                                        <span>
                                                            {category.name}
                                                        </span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))
                                        ) : (
                                            <DropdownMenuItem disabled>
                                                <span className="text-gray-500">
                                                    Loading...
                                                </span>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {isActive("/categories") && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kj-red animate-pulse"></div>
                                )}
                            </li>
                            <li className="relative">
                                <Link
                                    to="/products"
                                    className={`flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                        isActive("/products")
                                            ? "text-kj-red scale-105"
                                            : "hover:text-kj-red hover:scale-105"
                                    }`}
                                >
                                    <Package
                                        className={`h-5 w-5 transition-all duration-300 ${
                                            isActive("/products")
                                                ? "text-kj-red"
                                                : "group-hover:text-kj-red"
                                        }`}
                                    />
                                    <span>Produk</span>
                                </Link>
                                {isActive("/products") && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kj-red animate-pulse"></div>
                                )}
                            </li>
                            <li className="relative">
                                <Link
                                    to="/about"
                                    className={`flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                        isActive("/about")
                                            ? "text-kj-red scale-105"
                                            : "hover:text-kj-red hover:scale-105"
                                    }`}
                                >
                                    <Info
                                        className={`h-5 w-5 transition-all duration-300 ${
                                            isActive("/about")
                                                ? "text-kj-red"
                                                : "group-hover:text-kj-red"
                                        }`}
                                    />
                                    <span>Tentang Kami</span>
                                </Link>
                                {isActive("/about") && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kj-red animate-pulse"></div>
                                )}
                            </li>
                        </ul>
                    </nav>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/cart"
                            className={`relative flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                isActive("/cart")
                                    ? "text-kj-red scale-105"
                                    : "hover:text-kj-red hover:scale-105"
                            }`}
                        >
                            <div className="relative">
                                {isCartLoading ? (
                                    <Loader2 className="h-5 w-5 transition-all duration-300 animate-spin" />
                                ) : (
                                    <ShoppingCart
                                        className={`h-5 w-5 transition-all duration-300 ${
                                            !isActive("/cart") &&
                                            "group-hover:animate-bounce"
                                        }`}
                                    />
                                )}
                                {totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-kj-red text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold animate-pulse">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                )}
                            </div>
                            <span>Keranjang</span>
                            {isActive("/cart") && (
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kj-red animate-pulse"></div>
                            )}
                        </Link>

                        {isAuthLoading ? (
                            <div className="relative flex items-center space-x-2 font-medium text-lg transition-all duration-300 group">
                                <Loader2 className="h-5 w-5 animate-spin transition-all duration-300" />
                                <span className="font-medium text-lg">
                                    Loading...
                                </span>
                            </div>
                        ) : user ? (
                            <Link
                                to="/account"
                                className={`flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                    isActive("/account")
                                        ? "text-kj-red scale-105"
                                        : "hover:text-kj-red hover:scale-105"
                                }`}
                            >
                                <User
                                    className={`h-5 w-5 transition-all duration-300 ${
                                        isActive("/account")
                                            ? "text-kj-red"
                                            : "group-hover:text-kj-red"
                                    }`}
                                />
                                <span className="truncate max-w-24">
                                    {user.name}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                to="/auth"
                                className={`flex items-center space-x-2 font-medium text-lg transition-all duration-300 group ${
                                    isActive("/auth")
                                        ? "text-kj-red scale-105"
                                        : "hover:text-kj-red hover:scale-105"
                                }`}
                            >
                                <User
                                    className={`h-5 w-5 transition-all duration-300 ${
                                        isActive("/auth")
                                            ? "text-kj-red"
                                            : "group-hover:text-kj-red"
                                    }`}
                                />
                                <span>Masuk</span>
                            </Link>
                        )}
                    </div>

                    <div className="flex md:hidden items-center space-x-3">
                        <Link to="/cart" className="relative p-1 group">
                            <div className="relative">
                                {isCartLoading ? (
                                    <Loader2
                                        size={22}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <ShoppingCart
                                        size={22}
                                        className={`transition-all duration-300 ${
                                            isActive("/cart")
                                                ? "text-kj-red animate-bounce"
                                                : "group-hover:text-kj-red group-hover:animate-bounce"
                                        }`}
                                    />
                                )}
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-kj-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium animate-pulse">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="p-1 rounded-md hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                        >
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white absolute left-0 right-0 z-50 shadow-lg border-t animate-in slide-in-from-top-4 duration-300">
                        <div className="container-custom py-4">
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className={`flex items-center space-x-3 py-3 px-4 rounded-md transition-all duration-200 ${
                                            isActive("/")
                                                ? "bg-kj-red/10 text-kj-red border-l-4 border-kj-red"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Home className="h-5 w-5" />
                                        <span className="font-medium">
                                            Beranda
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/categories"
                                        className={`flex items-center space-x-3 py-3 px-4 rounded-md transition-all duration-200 ${
                                            isActive("/categories")
                                                ? "bg-kj-red/10 text-kj-red border-l-4 border-kj-red"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Grid3X3 className="h-5 w-5" />
                                        <span className="font-medium">
                                            Kategori
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/products"
                                        className={`flex items-center space-x-3 py-3 px-4 rounded-md transition-all duration-200 ${
                                            isActive("/products")
                                                ? "bg-kj-red/10 text-kj-red border-l-4 border-kj-red"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Package className="h-5 w-5" />
                                        <span className="font-medium">
                                            Produk
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className={`flex items-center space-x-3 py-3 px-4 rounded-md transition-all duration-200 ${
                                            isActive("/about")
                                                ? "bg-kj-red/10 text-kj-red border-l-4 border-kj-red"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Info className="h-5 w-5" />
                                        <span className="font-medium">
                                            Tentang Kami
                                        </span>
                                    </Link>
                                </li>
                                {isAuthLoading ? (
                                    <li className="flex items-center space-x-3 py-3 px-4">
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        <span className="text-gray-500">
                                            Loading...
                                        </span>
                                    </li>
                                ) : user ? (
                                    <li>
                                        <Link
                                            to="/account"
                                            className={`flex items-center space-x-3 py-3 px-4 rounded-md transition-all duration-200 ${
                                                isActive("/account")
                                                    ? "bg-kj-red/10 text-kj-red border-l-4 border-kj-red"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            <span className="font-medium">
                                                {user.name || user.email}
                                            </span>
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link
                                            to="/auth"
                                            className={`flex items-center space-x-3 py-3 px-4 rounded-md transition-all duration-200 ${
                                                isActive("/auth")
                                                    ? "bg-kj-red/10 text-kj-red border-l-4 border-kj-red"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            <span className="font-medium">
                                                Masuk
                                            </span>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
