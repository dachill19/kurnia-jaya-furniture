import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useLoadingStore } from "@/stores/loadingStore";
import logo from "@/assets/logo.png";
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    User,
    Phone,
    Mail,
    UserCog,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useProductStore } from "@/stores/productStore";

const Header = () => {
    const { cart, totalItems, fetchCart } = useCartStore();
    const { user, fetchProfile } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { categories, getCategories } = useProductStore();
    const navigate = useNavigate();

    // Loading states
    const isCartLoading = isLoadingKey("cart-fetch");
    const isAuthLoading =
        isLoadingKey("fetch-profile") || isLoadingKey("auth-initialize");

    useEffect(() => {
        getCategories();
    }, []);

    // Fetch cart when user changes
    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    const goToDashboard = () => {
        navigate("/admin/login");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setIsMenuOpen(false);
        }
    };

    // Check authentication state on component mount and auth state changes
    useEffect(() => {
        fetchProfile();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                await fetchProfile();
            } else if (event === "SIGNED_OUT") {
                // User will be set to null in the logout function
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    return (
        <header className="bg-white shadow-md relative">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-kj-brown to-kj-red text-white py-3">
                <div className="container-custom flex justify-between items-center">
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                        <a
                            href="https://wa.me/6282298528428"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-white/80 transition-colors"
                        >
                            <Phone className="h-4 w-4 mr-2" />
                            <span>+62 822-9852-8428</span>
                        </a>
                        <a
                            href="mailto:kurniajaya.furniture1688@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-white/80 transition-colors"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            <span>kurniajaya.furniture1688@gmail.com</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white text-sm hover:bg-white/10 flex items-center"
                            onClick={goToDashboard}
                        >
                            <UserCog className="h-4 w-4 mr-1.5" />
                            Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container-custom py-5">
                <div className="flex items-center justify-between">
                    {/* Logo - Made larger */}
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            alt="Kurnia Jaya Furniture"
                            className="h-16 md:h-20 w-auto"
                        />
                    </Link>

                    {/* Search Bar (desktop) */}
                    <div className="hidden md:block flex-grow max-w-md mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Cari furnitur..."
                                className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kj-red focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-kj-red transition-colors"
                                disabled={!searchQuery.trim()}
                            >
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Nav Actions (desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/cart"
                            className="flex items-center hover:text-kj-red relative transition-colors"
                        >
                            <div className="relative">
                                {isCartLoading ? (
                                    <Loader2
                                        size={22}
                                        className="mr-2 animate-spin"
                                    />
                                ) : (
                                    <ShoppingCart size={22} className="mr-2" />
                                )}
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-0 bg-kj-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                )}
                            </div>
                            <span className="font-medium">Keranjang</span>
                        </Link>

                        {isAuthLoading ? (
                            <div className="flex items-center">
                                <Loader2
                                    size={22}
                                    className="mr-2 animate-spin"
                                />
                                <span className="font-medium">Loading...</span>
                            </div>
                        ) : user ? (
                            <Link
                                to="/account"
                                className="flex items-center hover:text-kj-red transition-colors"
                            >
                                <User size={22} className="mr-2" />
                                <span className="font-medium truncate max-w-24">
                                    {user.name}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                to="/auth"
                                className="flex items-center hover:text-kj-red transition-colors"
                            >
                                <User size={22} className="mr-2" />
                                <span className="font-medium">Masuk</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center space-x-3">
                        <Link to="/cart" className="relative p-1">
                            <div className="relative">
                                {isCartLoading ? (
                                    <Loader2
                                        size={22}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <ShoppingCart size={22} />
                                )}
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-kj-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Navigation (desktop) */}
                <nav className="hidden md:flex mt-6 justify-center">
                    <ul className="flex space-x-12">
                        <li>
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-kj-red font-medium text-lg transition-colors"
                            >
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-gray-700 hover:text-kj-red font-medium text-lg transition-colors">
                                    Kategori
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white shadow-lg border">
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
                                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    {category.name}
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
                        </li>
                        <li>
                            <Link
                                to="/products"
                                className="text-gray-700 hover:text-kj-red font-medium text-lg transition-colors"
                            >
                                Produk
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-kj-red font-medium text-lg transition-colors"
                            >
                                Tentang Kami
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white absolute left-0 right-0 z-50 shadow-lg border-t animate-fade-in">
                        <div className="container-custom py-4">
                            {/* Search Bar (mobile) */}
                            <form
                                onSubmit={handleSearch}
                                className="relative mb-4"
                            >
                                <input
                                    type="text"
                                    placeholder="Cari furnitur..."
                                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kj-red focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-kj-red transition-colors"
                                    disabled={!searchQuery.trim()}
                                >
                                    <Search size={18} />
                                </button>
                            </form>

                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/categories"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Kategori
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/products"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Produk
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Tentang Kami
                                    </Link>
                                </li>
                                {isAuthLoading ? (
                                    <li className="flex items-center py-2 px-3">
                                        <Loader2
                                            size={18}
                                            className="mr-2 animate-spin"
                                        />
                                        <span className="text-gray-500">
                                            Loading...
                                        </span>
                                    </li>
                                ) : user ? (
                                    <li>
                                        <Link
                                            to="/account"
                                            className="block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {user.name || user.email}
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link
                                            to="/auth"
                                            className="block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Masuk
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
