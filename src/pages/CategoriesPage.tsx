import { useEffect, useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";
import { useProductStore } from "@/stores/productStore";

const CategoriesPage = () => {
    const { categories, getCategories } = useProductStore();

    useEffect(() => {
        getCategories();
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
                        Kategori Produk
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Temukan koleksi furnitur premium kami yang didesain
                        untuk memenuhi kebutuhan setiap ruangan di rumah Anda.
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
                                name={category.name}
                                imageUrl={category.image_url}
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
                        Tidak menemukan yang Anda cari?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        Hubungi tim kami untuk bantuan dalam menemukan furnitur
                        yang sempurna untuk kebutuhan Anda.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://wa.me/6282298528428"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-kj-red hover:bg-kj-darkred text-white px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            Hubungi Kami
                        </a>
                        <a
                            href="/products"
                            className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-kj-brown dark:text-white border border-kj-red dark:border-gray-600 px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            Jelajahi Semua Produk
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;
