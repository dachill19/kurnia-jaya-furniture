import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { ProductGridSkeleton } from "@/components/skeleton/ProductGridSkeleton";
import { CategoryGridSkeleton } from "@/components/skeleton/CategoryGridSkeleton";

const HomePage = () => {
    const {
        categories,
        getCategories,
        getHotProducts,
        getLatestProducts,
        error,
        clearError,
    } = useProductStore();

    const { isLoadingKey } = useLoadingStore();

    const [hotProducts, setHotProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);

    // Fetch Hot Products
    useEffect(() => {
        const fetchHot = async () => {
            try {
                await getHotProducts();
                const products = useProductStore
                    .getState()
                    .products.slice(0, 4);
                setHotProducts(products);
            } catch (error) {
                console.error("Error fetching hot products:", error);
            }
        };

        fetchHot();
    }, [getHotProducts]);

    // Fetch Latest Products
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                await getLatestProducts();
                const products = useProductStore
                    .getState()
                    .products.slice(0, 4);
                setLatestProducts(products);
            } catch (error) {
                console.error("Error fetching latest products:", error);
            }
        };

        fetchLatest();
    }, [getLatestProducts]);

    // Fetch Categories
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                await getCategories();
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchAllCategories();
    }, [getCategories]);

    // Clear errors on mount
    useEffect(() => {
        clearError();
    }, [clearError]);

    const transformProduct = (product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discount_price,
        images:
            product.product_image?.map((img: any) => ({
                imageUrl: img.image_url,
                isMain: img.is_main,
            })) || [],
        reviews: product.reviews || [],
        category: {
            name: product.category?.name || "Unknown Category",
        },
        isHot: product.is_hot || false,
        stock: product.stock || 0,
    });

    // Error Display Component
    const ErrorDisplay = ({
        message,
        onRetry,
    }: {
        message: string;
        onRetry?: () => void;
    }) => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline">
                    Coba Lagi
                </Button>
            )}
        </div>
    );

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
                            to="/products?filter=hot"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg transition-colors"
                        >
                            Lihat Semua
                            <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>

                    {isLoadingKey("hot-products") ? (
                        <ProductGridSkeleton count={4} />
                    ) : error ? (
                        <ErrorDisplay
                            message="Gagal memuat produk populer"
                            onRetry={() => {
                                getHotProducts().then(() => {
                                    const products = useProductStore
                                        .getState()
                                        .products.slice(0, 4);
                                    setHotProducts(products);
                                });
                            }}
                        />
                    ) : hotProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {hotProducts.map((product) => {
                                const transformedProduct =
                                    transformProduct(product);
                                return (
                                    <ProductCard
                                        key={transformedProduct.id}
                                        {...transformedProduct}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada produk populer tersedia
                        </div>
                    )}
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
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg transition-colors"
                        >
                            Lihat Semua
                            <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>

                    {isLoadingKey("categories") ? (
                        <CategoryGridSkeleton count={6} />
                    ) : error ? (
                        <ErrorDisplay
                            message="Gagal memuat kategori"
                            onRetry={() => {
                                getCategories();
                            }}
                        />
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.slice(0, 6).map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    name={category.name}
                                    imageUrl={category.image_url}
                                    productCount={category.productCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada kategori tersedia
                        </div>
                    )}
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
                            to="/products?filter=latest"
                            className="text-kj-red hover:text-kj-darkred flex items-center text-lg transition-colors"
                        >
                            Lihat Semua
                            <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>

                    {isLoadingKey("latest-products") ? (
                        <ProductGridSkeleton count={4} />
                    ) : error ? (
                        <ErrorDisplay
                            message="Gagal memuat produk terbaru"
                            onRetry={() => {
                                getLatestProducts().then(() => {
                                    const products = useProductStore
                                        .getState()
                                        .products.slice(0, 4);
                                    setLatestProducts(products);
                                });
                            }}
                        />
                    ) : latestProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {latestProducts.map((product) => {
                                const transformedProduct =
                                    transformProduct(product);
                                return (
                                    <ProductCard
                                        key={transformedProduct.id}
                                        {...transformedProduct}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada produk terbaru tersedia
                        </div>
                    )}
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
                                className="bg-transparent border-white text-white hover:bg-white hover:text-kj-red px-6 py-3 text-lg transition-colors"
                            >
                                <Link to="/products">Shop Now</Link>
                            </Button>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
                                alt="Promo Banner"
                                className="rounded-lg shadow-lg w-full h-auto max-h-[300px] object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
