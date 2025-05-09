import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";

const CategoriesPage = () => {
    const { language } = useLanguage();
    const [categories, setCategories] = useState([]);

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    return (
        <>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-kj-brown to-kj-red text-white py-16">
                <div className="container-custom text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
                        {language === "id"
                            ? "Kategori Produk"
                            : "Product Categories"}
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        {language === "id"
                            ? "Temukan koleksi furnitur premium kami yang didesain untuk memenuhi kebutuhan setiap ruangan di rumah Anda."
                            : "Discover our premium furniture collections designed to meet the needs of every room in your home."}
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container-custom py-16">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={item}>
                            <CategoryCard
                                id={category.id}
                                name={category.name}
                                imageUrl={category.imageUrl}
                                productCount={category.productCount}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-white dark:bg-gray-800 py-12 border-t border-gray-200 dark:border-gray-700">
                <div className="container-custom text-center">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-kj-brown dark:text-white mb-4">
                        {language === "id"
                            ? "Tidak menemukan yang Anda cari?"
                            : "Can't find what you're looking for?"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        {language === "id"
                            ? "Hubungi tim kami untuk bantuan dalam menemukan furnitur yang sempurna untuk kebutuhan Anda."
                            : "Contact our team for assistance in finding the perfect furniture for your needs."}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://wa.me/6282298528428"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-kj-red hover:bg-kj-darkred text-white px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            {language === "id" ? "Hubungi Kami" : "Contact Us"}
                        </a>
                        <a
                            href="/products"
                            className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-kj-brown dark:text-white border border-kj-red dark:border-gray-600 px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            {language === "id"
                                ? "Jelajahi Semua Produk"
                                : "Browse All Products"}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;
