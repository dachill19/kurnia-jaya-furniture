import { useParams, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/productStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/skeleton/ProductGridSkeleton";
import { CategoryPageSkeleton } from "@/components/skeleton/CategoryPageSkeleton";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const {
        categories,
        getCategories,
        getProductsByCategory,
        error,
        clearError,
    } = useProductStore();

    const { isLoadingKey } = useLoadingStore();

    const [categoryProducts, setCategoryProducts] = useState([]);

    // Cari kategori berdasarkan nama dari URL
    const decodedCategoryName = decodeURIComponent(categoryName || "");
    const category = categories.find(
        (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase()
    );

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

    // Fetch Products by Category
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            if (category?.id) {
                try {
                    await getProductsByCategory(category.id);
                    const products = useProductStore.getState().products;
                    setCategoryProducts(products);
                } catch (error) {
                    console.error("Error fetching category products:", error);
                }
            }
        };

        fetchCategoryProducts();
    }, [category?.id, getProductsByCategory]);

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

    // Loading state - menggunakan skeleton
    if (isLoadingKey("categories")) {
        return <CategoryPageSkeleton />;
    }

    // Kategori tidak ditemukan
    if (categories.length > 0 && !category) {
        return (
            <div className="container-custom py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Kategori tidak ditemukan
                </h1>
                <Link to="/categories" className="text-kj-red hover:underline">
                    Kembali ke daftar kategori
                </Link>
            </div>
        );
    }

    // Error handling
    if (error) {
        return (
            <div className="container-custom py-16 text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-600">
                    Terjadi Kesalahan
                </h1>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link to="/categories" className="text-kj-red hover:underline">
                    Kembali ke daftar kategori
                </Link>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            {/* Category Banner */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-8">
                <img
                    src={category.image_url || "/placeholder.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                    <div className="px-6">
                        <h1 className="text-3xl md:text-4xl text-white font-serif font-bold mb-2">
                            {category.name}
                        </h1>
                        <div className="flex text-white/80 text-sm">
                            <Link to="/" className="hover:text-white">
                                Beranda
                            </Link>
                            <ChevronRight className="mx-2" size={16} />
                            <Link to="/categories" className="hover:text-white">
                                Kategori
                            </Link>
                            <ChevronRight className="mx-2" size={16} />
                            <span>{category.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Count */}
            <div className="mb-6">
                <h2 className="text-xl font-medium">
                    {category.name} ({categoryProducts.length} {"produk"})
                </h2>
            </div>

            {/* Products Grid */}
            {isLoadingKey("products-by-category") ? (
                <ProductGridSkeleton count={8} />
            ) : error ? (
                <ErrorDisplay
                    message="Gagal memuat produk kategori"
                    onRetry={() => {
                        if (category?.id) {
                            getProductsByCategory(category.id).then(() => {
                                const products =
                                    useProductStore.getState().products;
                                setCategoryProducts(products);
                            });
                        }
                    }}
                />
            ) : categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => {
                        const transformedProduct = transformProduct(product);
                        return (
                            <ProductCard
                                key={transformedProduct.id}
                                {...transformedProduct}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-medium mb-2">
                        Tidak ada produk dalam kategori ini
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Kami segera menambahkan produk baru. Silakan periksa
                        kembali nanti.
                    </p>
                    <Link
                        to="/categories"
                        className="inline-flex items-center text-kj-red hover:underline"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Kembali ke daftar kategori
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
