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
    User,
    AlertTriangle,
} from "lucide-react";
import { useLoadingStore } from "@/stores/loadingStore";
import { ProductDetailPageSkeleton } from "@/components/skeleton/ProductDetailPageSkeleton";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { toast } = useToast();

    const { productDetail, getProductById, error } = useProductStore();
    const { addToCart } = useCartStore();
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlistStore();
    const { user } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();

    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (productId) {
            getProductById(productId);
        }
    }, [productId, getProductById]);

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

    const rating = product.reviews?.length
        ? product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
          product.reviews.length
        : 0;

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        } else {
            toast({
                title: "Stok tidak mencukupi",
                description: `Stok maksimal: ${product.stock} unit`,
                variant: "destructive",
            });
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setQuantity(1);
        } else if (value > product.stock) {
            setQuantity(product.stock);
            toast({
                title: "Stok tidak mencukupi",
                description: `Stok maksimal: ${product.stock} unit`,
                variant: "destructive",
            });
        } else {
            setQuantity(value);
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

        if (product.stock === 0) {
            toast({
                title: "Stok habis",
                description: "Produk ini sedang tidak tersedia",
                variant: "destructive",
            });
            return;
        }

        try {
            const mainImage =
                product.product_image?.find((img) => img.is_main)?.image_url ||
                product.product_image?.[0]?.image_url ||
                "";

            const result = await addToCart(
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    discount_price: product.discount_price,
                    image: mainImage,
                    stock: product.stock,
                },
                quantity
            );

            if (result.success) {
                toast({
                    title: "Produk ditambahkan ke keranjang",
                    description: `${product.name} (${quantity} unit)`,
                });
                setQuantity(1);
            } else {
                toast({
                    title: "Gagal menambahkan ke keranjang",
                    description: result.message || "Silakan coba lagi",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Gagal menambahkan ke keranjang",
                description: "Terjadi kesalahan sistem, silakan coba lagi",
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
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link disalin",
                    description: "Link produk telah disalin ke clipboard",
                });
            } catch (error) {
                toast({
                    title: "Gagal menyalin link",
                    description: "Silakan salin link secara manual",
                    variant: "destructive",
                });
            }
        }
    };

    const getDisplayName = (review: any) => {
        if (review.user?.name) {
            return review.user.name;
        }
        if (review.user?.email) {
            return review.user.email.split("@")[0];
        }
        return `User ${review.user_id.slice(0, 8)}...`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStockStatus = () => {
        if (product.stock === 0) {
            return {
                status: "out-of-stock",
                message: "Stok habis",
                color: "text-red-600",
                bgColor: "bg-red-50",
                icon: AlertTriangle,
            };
        } else if (product.stock <= 5) {
            return {
                status: "low-stock",
                message: `Stok terbatas: ${product.stock} unit`,
                color: "text-orange-600",
                bgColor: "bg-orange-50",
                icon: AlertTriangle,
            };
        } else {
            return {
                status: "in-stock",
                message: `Stok tersedia: ${product.stock} unit`,
                color: "text-green-600",
                bgColor: "bg-green-50",
                icon: Check,
            };
        }
    };

    const stockStatus = getStockStatus();
    const StockIcon = stockStatus.icon;

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

                        {/* Stock Status with improved styling */}
                        <div
                            className={`flex items-center p-3 rounded-lg ${stockStatus.bgColor} mb-4`}
                        >
                            <StockIcon
                                size={18}
                                className={`${stockStatus.color} mr-2`}
                            />
                            <span
                                className={`font-medium ${stockStatus.color}`}
                            >
                                {stockStatus.message}
                            </span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Jumlah
                            </h3>
                            <div className="flex items-center">
                                <button
                                    className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={handleQuantityInputChange}
                                    className="w-16 px-3 py-2 text-center border-t border-b border-gray-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                    onClick={increaseQuantity}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                                <span className="ml-3 text-sm text-gray-500">
                                    Max: {product.stock} unit
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                        <Button
                            variant="outline"
                            className="border-kj-red text-kj-red hover:bg-kj-red hover:text-white sm:flex-1"
                            onClick={handleAddToCart}
                            disabled={
                                product.stock === 0 || isLoadingKey("cart-add")
                            }
                        >
                            <ShoppingCart size={18} className="mr-2" />
                            {isLoadingKey("cart-add")
                                ? "Menambahkan..."
                                : product.stock === 0
                                ? "Stok Habis"
                                : "Tambah ke Keranjang"}
                        </Button>
                    </div>

                    {/* Extra Actions */}
                    <div className="flex space-x-4 text-gray-600">
                        <button
                            className="flex items-center hover:text-kj-red transition-colors"
                            onClick={handleToggleWishlist}
                            disabled={isLoadingKey("wishlist")}
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
                            className="flex items-center hover:text-kj-red transition-colors"
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
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mr-3">
                                                <User
                                                    size={16}
                                                    className="text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {getDisplayName(review)}
                                                </h4>
                                                <div className="flex items-center mt-1">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={16}
                                                                className={
                                                                    i <
                                                                    review.rating
                                                                        ? "text-yellow-500 fill-yellow-500"
                                                                        : "text-gray-300"
                                                                }
                                                            />
                                                        )
                                                    )}
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        {review.rating}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.created_at)}
                                        {review.updated_at &&
                                            new Date(
                                                review.updated_at
                                            ).getTime() !==
                                                new Date(
                                                    review.created_at
                                                ).getTime() && (
                                                <span className="ml-1">
                                                    (diedit pada{" "}
                                                    {formatDate(
                                                        review.updated_at
                                                    )}
                                                    )
                                                </span>
                                            )}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-3 leading-relaxed ml-11">
                                    {review.comment}
                                </p>

                                {/* Review Images */}
                                {review.review_image &&
                                    review.review_image.length > 0 && (
                                        <div className="flex space-x-2 flex-wrap gap-2 ml-11">
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
