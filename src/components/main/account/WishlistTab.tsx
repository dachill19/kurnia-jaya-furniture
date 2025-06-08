import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WishlistTabProps {
    addToCart: (item: any) => void;
    apiService: any;
}

const WishlistTab: React.FC<WishlistTabProps> = ({ addToCart, apiService }) => {
    const { toast } = useToast();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            if (!token) return;

            try {
                const response = await apiService.getWishlist(token);
                setWishlist(response.data);
            } catch (error) {
                console.error("Gagal mengambil wishlist:", error);
            }
        };

        fetchWishlist();
    }, [apiService]);

    const handleRemoveWishlist = async (productId: string) => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            await apiService.removeWishlistItem(productId, token);

            setWishlist((prev) =>
                prev.filter((item: any) => item.product.id !== productId)
            );
        } catch (error) {
            console.error("Gagal menghapus dari wishlist:", error);
        }
    };

    const handleAddToCart = (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const product = item.product;
        const mainImage =
            product.images.find((img: any) => img.isMain) || product.images[0];

        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice ?? product.price,
            image: mainImage,
        });

        toast({
            title: "Produk ditambahkan ke keranjang",
            description: product.name,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-medium">Wishlist Saya</h2>
            </div>

            {wishlist.length > 0 ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item: any) => {
                        const product = item.product;
                        const mainImage = product.images.find(
                            (img: { isMain: true }) => img.isMain
                        );

                        return (
                            <div
                                key={item.id}
                                className="border rounded-md p-3 flex"
                            >
                                <div className="w-20 h-20 rounded-md overflow-hidden">
                                    <img
                                        src={mainImage?.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="ml-3 flex-grow">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="font-medium hover:text-kj-red"
                                    >
                                        {product.name}
                                    </Link>
                                    <div className="mt-1 font-medium text-kj-red">
                                        {product.discountPrice ? (
                                            <div className="flex flex-col items-start">
                                                <span className="line-through text-xs text-gray-400 mb-1">
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }
                                                    ).format(product.price)}
                                                </span>
                                                <span className="text-base">
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }
                                                    ).format(
                                                        product.discountPrice
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-base">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                ).format(product.price)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex space-x-2 mt-2">
                                        <Button
                                            size="sm"
                                            onClick={(e) =>
                                                handleAddToCart(e, item)
                                            }
                                        >
                                            Tambah ke Keranjang
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleRemoveWishlist(product.id)
                                            }
                                        >
                                            Hapus
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
