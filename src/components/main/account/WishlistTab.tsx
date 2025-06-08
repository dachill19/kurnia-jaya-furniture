import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useLoadingStore } from "@/stores/loadingStore";

// Remove the addToCart prop since we'll use cartStore directly
const WishlistTab: React.FC = () => {
    const { toast } = useToast();
    
    // Zustand stores
    const {
        wishlist,
        error,
        fetchWishlist,
        removeFromWishlist,
        clearError
    } = useWishlistStore();
    
    const { addToCart } = useCartStore();
    const { isLoadingKey } = useLoadingStore();

    // Loading states
    const isFetchingWishlist = isLoadingKey("wishlist-fetch");
    const isAddingToCart = isLoadingKey("cart-add");

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Clear error when component unmounts or error changes
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
            clearError();
        }
    }, [error, toast, clearError]);

    const handleRemoveWishlist = async (productId: string) => {
        try {
            await removeFromWishlist(productId);
            toast({
                title: "Berhasil",
                description: "Produk berhasil dihapus dari wishlist",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Gagal menghapus dari wishlist",
                variant: "destructive",
            });
        }
    };

    const handleAddToCart = async (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const product = item.product;
        if (!product) return;

        try {
            // Find main image or use first available image
            const mainImage = product.product_image?.find(
                (img: any) => img.is_main
            ) || product.product_image?.[0];

            // Create cart item object matching CartItem interface
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                discount_price: product.discount_price,
                image: mainImage?.image_url || "",
            };

            // Add to cart using cartStore
            await addToCart(cartItem, 1);

            toast({
                title: "Berhasil",
                description: `${product.name} ditambahkan ke keranjang`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Gagal menambahkan ke keranjang",
                variant: "destructive",
            });
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(price);
    };

    if (isFetchingWishlist) {
        return (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="font-medium">Wishlist Saya</h2>
                </div>
                <div className="p-8 text-center">
                    <Loader2 size={48} className="mx-auto text-gray-300 mb-4 animate-spin" />
                    <p className="text-gray-600">Memuat wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-medium">Wishlist Saya</h2>
            </div>

            {wishlist.length > 0 ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => {
                        const product = item.product;
                        
                        if (!product) {
                            return null; // Skip items without product data
                        }

                        const mainImage = product.product_image?.find(
                            (img) => img.is_main
                        ) || product.product_image?.[0];

                        const isRemoving = isLoadingKey(`wishlist-remove-${product.id}`);

                        return (
                            <div
                                key={item.id}
                                className="border rounded-md p-3 flex"
                            >
                                <div className="w-20 h-20 rounded-md overflow-hidden">
                                    {mainImage ? (
                                        <img
                                            src={mainImage.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="ml-3 flex-grow">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="font-medium hover:text-kj-red"
                                    >
                                        {product.name}
                                    </Link>
                                    
                                    <div className="mt-1 font-medium text-kj-red">
                                        {product.discount_price ? (
                                            <div className="flex flex-col items-start">
                                                <span className="line-through text-xs text-gray-400 mb-1">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="text-base">
                                                    {formatPrice(product.discount_price)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-base">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>

                                    {product.category && (
                                        <div className="mt-1">
                                            <span className="text-xs text-gray-500">
                                                {product.category.name}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex space-x-2 mt-2">
                                        <Button
                                            size="sm"
                                            onClick={(e) => handleAddToCart(e, item)}
                                            disabled={isRemoving || isAddingToCart}
                                        >
                                            {isAddingToCart ? (
                                                <>
                                                    <Loader2 size={16} className="mr-1 animate-spin" />
                                                    Menambahkan...
                                                </>
                                            ) : (
                                                "Tambah ke Keranjang"
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveWishlist(product.id)}
                                            disabled={isRemoving || isAddingToCart}
                                        >
                                            {isRemoving ? (
                                                <>
                                                    <Loader2 size={16} className="mr-1 animate-spin" />
                                                    Menghapus...
                                                </>
                                            ) : (
                                                "Hapus"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                        Wishlist kosong
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Anda belum menambahkan produk apa pun ke wishlist.
                    </p>
                    <Button asChild>
                        <Link to="/products">Jelajahi Produk</Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default WishlistTab;
