import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Check,
    MessageSquare,
    ChevronRight,
    HeartOff,
} from "lucide-react";
import { useLoadingStore } from "@/stores/loadingStore";
import { ProductDetailPageSkeleton } from "@/components/skeleton/ProductDetailPageSkeleton";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { toast } = useToast();

    // Store hooks
    const { productDetail, getProductById, error } = useProductStore();
    const { addToCart } = useCartStore();
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlistStore();
    const { user } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();

    // Local state
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (productId) {
            getProductById(productId);
        }
    }, [productId, getProductById]);

    // Reset selected image when product changes
    useEffect(() => {
        if (productDetail?.product_image) {
            const mainImageIndex = productDetail.product_image.findIndex(
                (img) => img.is_main
            );
            setSelectedImage(mainImageIndex >= 0 ? mainImageIndex : 0);
        }
    }, [productDetail]);

    if (isLoadingKey("product-detail")) {
        return <ProductDetailPageSkeleton />;
    }

    if (error) {
        return (
            <div className="container-custom py-16 text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-600">
                    Terjadi Kesalahan
                </h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button asChild>
                    <Link to="/products">Kembali ke Produk</Link>
                </Button>
            </div>
        );
    }

    if (!productDetail) {
        return (
            <div className="container-custom py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Produk tidak ditemukan
                </h1>
                <p className="text-gray-600 mb-6">
                    Maaf, produk yang Anda cari tidak ditemukan.
                </p>
                <Button asChild>
                    <Link to="/products">Kembali ke Produk</Link>
                </Button>
            </div>
        );
    }

    const product = productDetail;
    const images = product.product_image?.map((img) => img.image_url) || [];
    const inWishlist = isInWishlist(product.id);

    // Calculate average rating
    const rating = product.reviews?.length
        ? product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
          product.reviews.length
        : 0;

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast({
                title: "Akses ditolak",
                description: "Silakan login terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        try {
            const mainImage =
                product.product_image?.find((img) => img.is_main)?.image_url ||
                product.product_image?.[0]?.image_url ||
                "";

            await addToCart(
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    discount_price: product.discount_price,
                    image: mainImage,
                },
                quantity
            );

            toast({
                title: "Produk ditambahkan ke keranjang",
                description: product.name,
            });
        } catch (error) {
            toast({
                title: "Gagal menambahkan ke keranjang",
                description: "Silakan coba lagi",
                variant: "destructive",
            });
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast({
                title: "Akses ditolak",
                description: "Silakan login terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        try {
            if (inWishlist) {
                await removeFromWishlist(product.id);
                toast({
                    title: "Dihapus dari wishlist",
                    description: product.name,
                });
            } else {
                await addToWishlist(product.id);
                toast({
                    title: "Ditambahkan ke wishlist",
                    description: product.name,
                });
            }
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message || "Gagal mengubah wishlist",
                variant: "destructive",
            });
        }
    };

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: "Lihat produk ini!",
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Gagal membagikan:", error);
            }
        } else {
            // fallback: salin ke clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert(
                    "Link disalin ke clipboard karena fitur share tidak tersedia."
                );
            } catch (error) {
                toast({
                    title: "Gagal menyalin link",
                    description: "Silakan salin link secara manual",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="container-custom py-8">
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm">
                <Link to="/" className="text-gray-500 hover:text-kj-red">
                    Beranda
                </Link>
                <ChevronRight className="mx-2 text-gray-400" size={16} />
                <Link
                    to="/categories"
                    className="text-gray-500 hover:text-kj-red"
                >
                    Kategori
                </Link>
                <ChevronRight className="mx-2 text-gray-400" size={16} />
                <Link
                    to={`/categories/${encodeURIComponent(
                        product.category?.name || ""
                    )}`}
                    className="text-gray-500 hover:text-kj-red"
                >
                    {product.category?.name}
                </Link>
                <ChevronRight className="mx-2 text-gray-400" size={16} />
                <span className="text-gray-900">{product.name}</span>
            </nav>

            {/* Product Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Product Images */}
                <div>
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={
                                images[selectedImage] ||
                                images[0] ||
                                "/placeholder-image.jpg"
                            }
                            alt={product.name}
                            className="w-full h-[400px] object-cover object-center"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex space-x-2">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`border rounded-md overflow-hidden w-20 h-20 ${
                                        selectedImage === index
                                            ? "border-kj-red"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} - Image ${
                                            index + 1
                                        }`}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                        {product.name}
                    </h1>

                    <div className="flex items-center mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={
                                        i < Math.floor(rating)
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                            {rating.toFixed(1)} ({product.reviews?.length || 0}{" "}
                            ulasan)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        {product.discount_price ? (
                            <div className="flex flex-col items-start">
                                <span className="line-through text-xl text-gray-400 mb-1">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(product.price)}
                                </span>
                                <span className="text-2xl font-bold text-kj-red">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(product.discount_price)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-kj-red">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(product.price)}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            {product.description}
                        </p>
                        <div className="flex items-center text-gray-600 mb-2">
                            <Check size={18} className="text-green-500 mr-2" />
                            <span>
                                {"Stok tersedia:"} {product.stock} {"unit"}
                            </span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-3">
                            Jumlah
                        </h3>
                        <div className="flex">
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                                onClick={decreaseQuantity}
                            >
                                -
                            </button>
                            <div className="w-12 px-3 py-1 text-center border-t border-b border-gray-300">
                                {quantity}
                            </div>
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                                onClick={increaseQuantity}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                        <Button
                            variant="outline"
                            className="border-kj-red text-kj-red hover:bg-kj-red hover:text-white sm:flex-1"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={18} className="mr-2" />
                            {product.stock === 0
                                ? "Stok Habis"
                                : "Tambah ke Keranjang"}
                        </Button>
                    </div>

                    {/* Extra Actions */}
                    <div className="flex space-x-4 text-gray-600">
                        <button
                            className="flex items-center hover:text-kj-red"
                            onClick={handleToggleWishlist}
                        >
                            {inWishlist ? (
                                <>
                                    <HeartOff size={18} className="mr-1" />
                                    <span>Hapus dari Wishlist</span>
                                </>
                            ) : (
                                <>
                                    <Heart size={18} className="mr-1" />
                                    <span>Tambah ke Wishlist</span>
                                </>
                            )}
                        </button>
                        <button
                            className="flex items-center hover:text-kj-red"
                            onClick={handleWebShare}
                        >
                            <Share2 size={18} className="mr-1" />
                            <span>Bagikan</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-6">Ulasan Produk</h2>

                <div className="flex items-center mb-6">
                    <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={24}
                                className={
                                    i < Math.floor(rating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-xl font-semibold">
                        {rating.toFixed(1)}/5
                    </span>
                    <span className="ml-2 text-gray-600">
                        ({product.reviews?.length || 0} ulasan)
                    </span>
                </div>

                {/* Review List */}
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            User {review.user_id.slice(0, 8)}...
                                        </h4>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={
                                                        i < review.rating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-gray-300"
                                                    }
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            review.created_at
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    {review.comment}
                                </p>

                                {/* Review Images */}
                                {review.review_image &&
                                    review.review_image.length > 0 && (
                                        <div className="flex space-x-2 flex-wrap gap-2">
                                            {review.review_image.map(
                                                (image, index) => (
                                                    <div
                                                        key={image.id}
                                                        className="w-20 h-20 rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                                                    >
                                                        <img
                                                            src={
                                                                image.image_url
                                                            }
                                                            alt={`Review gambar ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => {
                                                                // Optional: Add modal to view full image
                                                                window.open(
                                                                    image.image_url,
                                                                    "_blank"
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MessageSquare
                            size={48}
                            className="mx-auto text-gray-400 mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Belum ada ulasan
                        </h3>
                        <p className="text-gray-500">
                            Jadilah yang pertama memberikan ulasan untuk produk
                            ini.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
