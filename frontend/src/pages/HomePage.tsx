import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import apiService from "@/services/apiService";

const HomePage = () => {
    const [hotProducts, setHotProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                const response = await apiService.getHotProducts();
                const data = response.data.slice(0, 4);
                setHotProducts(data);
            } catch (error) {
                console.error("Gagal mengambil hot products:", error);
            }
        };

        fetchHotProducts();
    }, []);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await apiService.getLatestProducts();
                const data = response.data.slice(0, 4);
                setLatestProducts(data);
            } catch (error) {
                console.error("Gagal mengambil produk terbaru:", error);
            }
        };

        fetchLatestProducts();
    }, []);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService.getCategories();
                const data = response.data.slice(0, 6);
                setCategories(data);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            {/* Hero Banner */}
            <Hero />

            {/* Features */}
            <FeatureSection />

            {/* Hot Products Section */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="section-title text-3xl">
                            Produk Populer
                        </h2>
                        <Link
                            to="/products"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg"
                        >
                            Lihat Semua
                            <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hotProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                discountPrice={product.discountPrice}
                                images={product.images}
                                reviews={product.reviews}
                                category={product.category}
                                isHot={product.isHot}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="section-title text-3xl">
                            Belanja berdasarkan Kategori
                        </h2>
                        <Link
                            to="/categories"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg"
                        >
                            Lihat Semua
                            <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                id={category.id}
                                name={category.name}
                                imageUrl={category.imageUrl}
                                productCount={category.productCount}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="section-title text-3xl">
                            Produk Terbaru
                        </h2>
                        <Link
                            to="/products"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg"
                        >
                            Lihat Semua
                            <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                discountPrice={product.discountPrice}
                                images={product.images}
                                reviews={product.reviews}
                                category={product.category}
                                isHot={product.isHot}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="py-16 bg-kj-red text-white">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                                Special Discount 20% Off
                            </h2>
                            <p className="text-white/90 text-lg mb-6">
                                For all furniture purchases above IDR 5,000,000
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="bg-transparent border-white text-white hover:bg-white hover:text-kj-red px-6 py-2 text-lg"
                            >
                                <Link to="/products">Shop Now</Link>
                            </Button>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
                                alt="Promo Banner"
                                className="rounded-lg shadow-lg w-full h-auto max-h-[300px] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
