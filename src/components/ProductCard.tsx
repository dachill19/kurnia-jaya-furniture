import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useLoadingStore } from "@/stores/loadingStore";

interface ProductImage {
    imageUrl: string;
    isMain: boolean;
}

interface Review {
    rating: number;
}

interface Category {
    name: string;
}

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    stock: number; // Added stock prop
    images: ProductImage[];
    reviews?: Review[];
    category: Category;
    isHot?: boolean;
}

const ProductCard = ({
    id,
    name,
    price,
    discountPrice,
    stock = 0, // Default stock to 0
    images = [],
    reviews = [],
    category,
    isHot = false,
}: ProductCardProps) => {
    const { addToCart } = useCartStore();
    const { user } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();
    const { toast } = useToast();

    // Check if adding to cart is in progress
    const isAddingToCart = isLoadingKey("cart-add");

    // Ambil gambar utama dengan safety check
    const imageUrl =
        images && images.length > 0
            ? images.find((img) => img.isMain)?.imageUrl ||
              images[0]?.imageUrl ||
              ""
            : "";

    // Check if product is out of stock
    const isOutOfStock = stock <= 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is authenticated
        if (!user) {
            toast({
                title: "Akses ditolak",
                description: "Silakan login terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        // Check if product is out of stock
        if (isOutOfStock) {
            toast({
                title: "Stok habis",
                description: "Produk ini sedang tidak tersedia",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await addToCart({
                id,
                name,
                price: price,
                discount_price: discountPrice || null,
                image: imageUrl,
                stock, // Include stock in the item
            });

            if (result.success) {
                toast({
                    title: "Produk ditambahkan ke keranjang",
                    description: name,
                });
            } else {
                toast({
                    title: "Gagal menambahkan ke keranjang",
                    description:
                        result.message ||
                        "Terjadi kesalahan, silakan coba lagi",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Gagal menambahkan ke keranjang",
                description: "Terjadi kesalahan, silakan coba lagi",
                variant: "destructive",
            });
        }
    };

    // Hitung rata-rata rating
    const avgRating =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return (
        <div className="card-product group h-full">
            <Link to={`/products/${id}`} className="block h-full">
                <div className="relative pt-[100%] overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                    {/* Stock overlay for out of stock items */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                                STOK HABIS
                            </span>
                        </div>
                    )}
                    {isHot && !isOutOfStock && (
                        <div className="absolute top-2 right-2 bg-kj-red text-white text-xs font-bold px-2 py-1 rounded-full">
                            HOT
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">
                        {category?.name || "Unknown Category"}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {name}
                    </h3>
                    <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={
                                    i < Math.round(avgRating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                            ({avgRating.toFixed(1)})
                        </span>
                    </div>

                    {/* Stock indicator */}
                    <div className="mb-2">
                        {isOutOfStock ? (
                            <span className="text-sm text-red-500 font-medium">
                                Stok habis
                            </span>
                        ) : stock <= 5 ? (
                            <span className="text-sm text-orange-500 font-medium">
                                Stok terbatas ({stock} tersisa)
                            </span>
                        ) : (
                            <span className="text-sm text-green-600">
                                Stok tersedia
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-kj-red font-bold">
                            {discountPrice ? (
                                <div className="flex flex-col items-start">
                                    <span className="line-through text-sm text-gray-400 mb-1">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(price)}
                                    </span>
                                    <span className="text-xl">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(discountPrice)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xl">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(price)}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`text-kj-red border-kj-red hover:bg-kj-red hover:text-white disabled:opacity-50 ${
                                isOutOfStock
                                    ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-100 hover:text-gray-400"
                                    : ""
                            }`}
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || isOutOfStock}
                            title={
                                isOutOfStock
                                    ? "Stok habis"
                                    : "Tambah ke keranjang"
                            }
                        >
                            {isAddingToCart ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                                <ShoppingCart size={16} />
                            )}
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
