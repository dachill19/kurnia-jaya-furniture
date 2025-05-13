import { useParams, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/categories/${encodeURIComponent(
                        categoryName
                    )}`
                );
                setProducts(response.data);
            } catch (error) {
                console.error("Gagal mengambil produk:", error);
            }
        };

        fetchProductsByCategory();
    }, [categoryName]);

    const category = products.length > 0 ? products[0].category : null;

    if (!category) {
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

    return (
        <div className="container-custom py-8">
            {/* Category Banner */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-8">
                <img
                    src={category.imageUrl || "/placeholder.jpg"} // fallback jika imageUrl null
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
                    {category.name} ({products.length} {"produk"})
                </h2>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
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
