import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Info,
    Check,
    Truck,
    MessageSquare,
    ChevronRight,
    HeartOff,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/services/apiService";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiService.getProductById(productId);
                setProduct(response.data);
            } catch (error) {
                console.error("Gagal mengambil produk:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    useEffect(() => {
        const checkWishlist = async () => {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            if (!token) return;

            try {
                const response = await apiService.getWishlist(token);
                const wishlist = response.data;
                const isWishlisted = wishlist.some(
                    (item: { productId: string }) =>
                        item.productId === productId
                );
                setInWishlist(isWishlisted);
            } catch (error) {
                console.error("Gagal cek wishlist:", error);
            }
        };

        checkWishlist();
    }, [productId]);

    if (!product) {
        return (
            <div className="container-custom py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Produk tidak ditemukan
                </h1>
                <p className="text-gray-600 mb-6">
                    Maaf, produk yang Anda cari tidak ditemukan.
                </p>
                <Button asChild>
                    <Link to="/products">Produk</Link>
                </Button>
            </div>
        );
    }

    const images = product.images.map(
        (img: { imageUrl: string }) => img.imageUrl
    );
    const mainImageIndex =
        product.images.findIndex((img: { isMain: true }) => img.isMain) || 0;

    const rating = product.reviews.length
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

    const handleAddToCart = () => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            toast({
                title: "Akses ditolak",
                description: "Silakan login terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
            },
            quantity
        );

        toast({
            title: "Produk ditambahkan ke keranjang",
            description: product.name,
        });
    };

    const handleToggleWishlist = async () => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            if (!token) {
                toast({
                    title: "Akses ditolak",
                    description: "Silakan login terlebih dahulu",
                    variant: "destructive",
                });
                return;
            }

            if (inWishlist) {
                await apiService.removeWishlistItem(productId, token);

                toast({
                    title: "Dihapus dari wishlist",
                    description: product.name,
                });

                setInWishlist(false);
            } else {
                await apiService.addWishlist(product.id, token);

                toast({
                    title: "Ditambahkan ke wishlist",
                    description: product.name,
                });

                setInWishlist(true);
            }
        } catch (error) {
            console.error("Gagal menambahkan ke wishlist:", error);
            toast({
                title: "Gagal",
                description: "Gagal menambahkan ke wishlist",
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
            await navigator.clipboard.writeText(window.location.href);
            alert(
                "Link disalin ke clipboard karena fitur share tidak tersedia."
            );
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
                        product.category.name
                    )}`}
                    className="text-gray-500 hover:text-kj-red"
                >
                    {product.category.name}
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
                                images[selectedImage] || images[mainImageIndex]
                            }
                            alt={product.name}
                            className="w-full h-[400px] object-cover object-center"
                        />
                    </div>
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
                                    alt={`${product.name} - Image ${index + 1}`}
                                    className="w-full h-full object-cover object-center"
                                />
                            </button>
                        ))}
                    </div>
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
                            {rating.toFixed(1)} ({product.reviews.length}{" "}
                            ulasan)
                        </span>
                    </div>

                    {product.discountPrice ? (
                        <div className="flex flex-col items-start">
                            <span className="line-through text-xl text-gray-400 mb-1">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(product.price)}
                            </span>
                            <span className="text-2xl font-bold text-kj-red mb-6">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(product.discountPrice)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-kj-red mb-6">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(product.price)}
                        </span>
                    )}

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
                        {/* <Button
                            className="bg-kj-red hover:bg-kj-darkred text-white sm:flex-1"
                            onClick={handleBuyNow}
                        >
                            Beli Sekarang
                        </Button> */}
                        <Button
                            variant="outline"
                            className="border-kj-red text-kj-red hover:bg-kj-red hover:text-white sm:flex-1"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={18} className="mr-2" />
                            Tambah ke Keranjang
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
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={24}
                                className={
                                    i < Math.floor(product.rating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-xl font-semibold">
                        {product.rating}/5
                    </span>
                    <span className="ml-2 text-gray-600">
                        ({product.reviews.length} ulasan)
                    </span>
                </div>

                {/* Review List */}
                {product.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-semibold">
                                        {review.user.name}
                                    </h4>
                                    <span className="text-gray-500">
                                        {review.createdAt}
                                    </span>
                                </div>
                                <div className="flex items-center mb-3">
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
                                </div>
                                <p className="text-gray-700 mb-3">
                                    {review.comment}
                                </p>
                                {review.reviewImages && (
                                    <div className="flex space-x-2">
                                        {review.reviewImages.map(
                                            (image, index) => (
                                                <div
                                                    key={index}
                                                    className="w-20 h-20 rounded-md overflow-hidden"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Review image ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
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
                    <div className="text-center py-8">
                        <MessageSquare
                            size={48}
                            className="mx-auto text-gray-300 mb-2"
                        />
                        <p className="text-gray-500">
                            Belum ada ulasan untuk produk ini.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
