import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
    const { t } = useLanguage();
    const [hotProducts, setHotProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/products/hot"
                );
                const data = response.data.slice(0, 4);
                setHotProducts(data);
            } catch (error) {
                console.error("Gagal mengambil hot products:", error);
            }
        };

        fetchHotProducts();
    }, []);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/categories"
                );
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
                            {t("hotProducts")}
                        </h2>
                        <Link
                            to="/products"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg"
                        >
                            {t("viewAll")}{" "}
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
                            {t("shopByCategory")}
                        </h2>
                        <Link
                            to="/categories"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg"
                        >
                            {t("viewAll")}{" "}
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
        </div>
    );
};

export default HomePage;
