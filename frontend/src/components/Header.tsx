import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { startCase, kebabCase } from "lodash";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import logo from '@/assets/logo.png';
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    User,
    Globe,
    Phone,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
    console.log('Rendering Header');
    const { t, language, setLanguage } = useLanguage();
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'id' ? 'en' : 'id');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search logic goes here
        console.log("Searching for:", searchQuery);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Gagal ambil kategori:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <header className="bg-white shadow-md">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-kj-brown to-kj-red text-white py-3">
                <div className="container-custom flex justify-between items-center">
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                        <a href="tel:+6212345678" className="flex items-center hover:text-white/80 transition-colors">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>+62 123 4567 890</span>
                        </a>
                        <a href="mailto:info@kurniajaya.com" className="flex items-center hover:text-white/80 transition-colors">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>info@kurniajaya.com</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white text-sm hover:bg-white/10 flex items-center"
                            onClick={toggleLanguage}
                        >
                            <Globe className="h-4 w-4 mr-1.5" />
                            {language.toUpperCase()}
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
                                placeholder={t('searchPlaceholder')}
                                className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kj-red focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-kj-red"
                            >
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Nav Actions (desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/signin" className="flex items-center hover:text-kj-red">
                            <User size={22} className="mr-2" />
                            <span className="font-medium">{t('signIn')}</span>
                        </Link>
                        <Link
                            to="/cart"
                            className="flex items-center hover:text-kj-red relative"
                        >
                            <ShoppingCart size={22} className="mr-2" />
                            <span className="font-medium">{t('navCart')}</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-kj-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center space-x-3">
                        <Link
                            to="/cart"
                            className="relative p-1"
                        >
                            <ShoppingCart size={22} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-kj-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Navigation (desktop) */}
                <nav className="hidden md:flex mt-6 justify-center">
                    <ul className="flex space-x-12">
                        <li>
                            <Link to="/" className="text-gray-700 hover:text-kj-red font-medium text-lg">
                                {t('navHome')}
                            </Link>
                        </li>
                        <li>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-gray-700 hover:text-kj-red font-medium text-lg">
                                    {t('navCategories')}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white">
                                    {categories.map((category) => (
                                        <DropdownMenuItem asChild key={category.id}>
                                            <Link to={`/categories/${kebabCase(category.name)}`} className="cursor-pointer">
                                                {startCase(category.name)}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li>
                            <Link to="/products" className="text-gray-700 hover:text-kj-red font-medium text-lg">
                                {t('navProducts')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-gray-700 hover:text-kj-red font-medium text-lg">
                                {t('navAbout')}
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white absolute left-0 right-0 z-50 shadow-lg border-t animate-fade-in">
                        <div className="container-custom py-4">
                            {/* Search Bar (mobile) */}
                            <form onSubmit={handleSearch} className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kj-red focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-kj-red"
                                >
                                    <Search size={18} />
                                </button>
                            </form>

                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('navHome')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/categories"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('navCategories')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/products"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('navProducts')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('navAbout')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signin"
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('signIn')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;