import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { startCase, kebabCase } from "lodash";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/categories"
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-16 pb-8">
            <div className="container-custom">
                {/* Footer Top */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            Kurnia Jaya Furniture
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            #1 Best Furniture in Town - Menyediakan furnitur
                            berkualitas dengan desain modern dan harga
                            terjangkau.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-kj-red hover:text-kj-darkred dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-kj-red hover:text-kj-darkred dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-kj-red hover:text-kj-darkred dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-kj-red hover:text-kj-darkred dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md"
                            >
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Categories */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            {t("categories")}
                        </h3>
                        <ul className="space-y-4">
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    className="transform hover:translate-x-1 transition-transform"
                                >
                                    <Link
                                        to={`/categories/${kebabCase(
                                            category.name
                                        )}`}
                                        className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                    >
                                        <span className="mr-2">›</span>
                                        {startCase(category.name)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Links */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            {t("customerService")}
                        </h3>
                        <ul className="space-y-4">
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/about"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    {t("aboutUs")}
                                </Link>
                            </li>
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/track-order"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    {t("trackOrder")}
                                </Link>
                            </li>
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/payment"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    {t("payment")}
                                </Link>
                            </li>
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/shipping"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    {t("shipping")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            {t("contactUs")}
                        </h3>
                        <ul className="space-y-5">
                            <li className="flex items-start">
                                <MapPin
                                    size={20}
                                    className="text-kj-red mt-1 mr-3"
                                />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Jl. Furniture No. 123
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="text-kj-red mr-3" />
                                <a
                                    href="tel:+6212345678"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red"
                                >
                                    +62 123 4567 890
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="text-kj-red mr-3" />
                                <a
                                    href="mailto:info@kurniajaya.com"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red"
                                >
                                    info@kurniajaya.com
                                </a>
                            </li>
                        </ul>
                        <Button className="mt-6 bg-kj-red hover:bg-kj-darkred flex items-center gap-2">
                            <span>Chat on WhatsApp</span>
                            <ExternalLink size={16} />
                        </Button>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="py-8 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl font-serif font-bold mb-2">
                                Subscribe to Our Newsletter
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Get the latest updates, offers and design
                                inspiration.
                            </p>
                        </div>
                        <div>
                            <form className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    className="flex-grow rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-kj-red"
                                    placeholder="Your email address"
                                />
                                <Button
                                    type="submit"
                                    className="bg-kj-red hover:bg-kj-darkred"
                                >
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Kurnia Jaya Furniture.
                        All rights reserved.
                    </p>
                    <div className="flex space-x-8">
                        <Link
                            to="/privacy-policy"
                            className="text-gray-600 dark:text-gray-400 hover:text-kj-red dark:hover:text-kj-red text-sm"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-gray-600 dark:text-gray-400 hover:text-kj-red dark:hover:text-kj-red text-sm"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/sitemap"
                            className="text-gray-600 dark:text-gray-400 hover:text-kj-red dark:hover:text-kj-red text-sm"
                        >
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
