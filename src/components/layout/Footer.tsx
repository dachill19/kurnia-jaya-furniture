import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { useProductStore } from "@/stores/productStore";

const Footer = () => {
    const { categories, getCategories } = useProductStore();

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-16 pb-8">
            <div className="container-custom">
                {/* Footer Top */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            Kurnia Jaya Furniture
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            #1 best Furniture in Town - Menyediakan furniture
                            berkualitas dengan desain modern dan pelayanan
                            terbaik.
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
                            Kategori
                        </h3>
                        <ul className="space-y-4">
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    className="transform hover:translate-x-1 transition-transform"
                                >
                                    <Link
                                        to={`/categories/${encodeURIComponent(
                                            category.name
                                        )}`}
                                        className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                    >
                                        <span className="mr-2">›</span>
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Links */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            Layanan Pelanggan
                        </h3>
                        <ul className="space-y-4">
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/about"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    Tentang Kami
                                </Link>
                            </li>
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/track-order"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    Lacak Pesanan
                                </Link>
                            </li>
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/payment"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    Pembayaran
                                </Link>
                            </li>
                            <li className="transform hover:translate-x-1 transition-transform">
                                <Link
                                    to="/shipping"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red flex items-center"
                                >
                                    <span className="mr-2">›</span>
                                    Pengiriman
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-kj-brown dark:text-white mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-kj-red after:-mb-2">
                            Hubungi Kami
                        </h3>
                        <ul className="space-y-5">
                            <li className="flex items-start">
                                <MapPin
                                    size={20}
                                    className="text-kj-red mt-1 mr-3 flex-shrink-0"
                                />
                                <a
                                    href="https://maps.app.goo.gl/vq1j9ZcE7HLffR8u9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red"
                                >
                                    JI. Raya Serang KM.15 No. 42-45, Talagasari,
                                    Kec. Cikupa, Kab. Tangerang, Banten, 15710
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Phone
                                    size={20}
                                    className="text-kj-red mr-3 flex-shrink-0"
                                />
                                <a
                                    href="https://wa.me/6282298528428"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red"
                                >
                                    +62 822-9852-8428
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail
                                    size={20}
                                    className="text-kj-red mr-3 flex-shrink-0"
                                />
                                <a
                                    href="mailto:kurniajaya.furniture1688@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-kj-red dark:hover:text-kj-red"
                                >
                                    kurniajaya.furniture1688
                                </a>
                            </li>
                        </ul>
                        <a
                            href="https://wa.me/6282298528428"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="mt-6 bg-kj-red hover:bg-kj-darkred flex items-center gap-2">
                                <span>Chat on WhatsApp</span>
                                <ExternalLink size={16} />
                            </Button>
                        </a>
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
