import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
    const [hotProducts, setHotProducts] = useState([]);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/products/hot"
                );
                // Misal kamu hanya ingin ambil 4 produk teratas:
                const data = response.data.slice(0, 4);
                setHotProducts(data);
            } catch (error) {
                console.error("Gagal mengambil hot products:", error);
            }
        };

        fetchHotProducts();
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
                        <h2 className="section-title text-3xl">{"Hot"}</h2>
                        <Link
                            to="/products"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg"
                        >
                            {"View All"}{" "}
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
        </div>
    );
};

export default HomePage;
