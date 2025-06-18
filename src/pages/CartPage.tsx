import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    ShoppingCart,
    ChevronLeft,
    Plus,
    Minus,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CartPageSkeleton } from "@/components/skeleton/CartPageSkeleton";

const CartPage = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        fetchCart,
        getDisplayPrice,
    } = useCartStore();

    const { isLoadingKey } = useLoadingStore();
    const [errorMessages, setErrorMessages] = useState<{
        [key: string]: string;
    }>({});

    // State untuk tracking loading per item
    const [loadingQuantity, setLoadingQuantity] = useState<{
        [key: string]: boolean;
    }>({});

    // Fetch cart data when component mounts
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Handle quantity update with validation
    const handleQuantityUpdate = async (
        productId: string,
        newQuantity: number
    ) => {
        // Set loading untuk item ini
        setLoadingQuantity((prev) => ({
            ...prev,
            [productId]: true,
        }));

        const result = await updateQuantity(productId, newQuantity);

        // Remove loading untuk item ini
        setLoadingQuantity((prev) => {
            const newLoading = { ...prev };
            delete newLoading[productId];
            return newLoading;
        });

        if (!result.success && result.message) {
            setErrorMessages((prev) => ({
                ...prev,
                [productId]: result.message,
            }));
            // Clear error message after 3 seconds
            setTimeout(() => {
                setErrorMessages((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[productId];
                    return newErrors;
                });
            }, 3000);
        } else {
            // Clear any existing error for this product
            setErrorMessages((prev) => {
                const newErrors = { ...prev };
                delete newErrors[productId];
                return newErrors;
            });
        }
    };

    // Show skeleton while loading cart data (initial fetch only)
    if (isLoadingKey("cart-fetch")) {
        return <CartPageSkeleton />;
    }

    if (cart.length === 0) {
        return (
            <div className="container-custom py-16 text-center">
                <div className="max-w-md mx-auto">
                    <ShoppingCart
                        size={64}
                        className="mx-auto text-gray-300 mb-4"
                    />
                    <h1 className="text-2xl font-serif font-bold mb-4">
                        Keranjang Anda kosong
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Sepertinya Anda belum menambahkan produk apa pun ke
                        keranjang.
                    </p>
                    <Button asChild>
                        <Link to="/products">
                            <ChevronLeft size={16} className="mr-2" />
                            Lanjutkan Belanja
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">
                Keranjang Belanja
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="font-medium">
                                    {"Produk"} ({totalItems})
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500"
                                    onClick={clearCart}
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Hapus Semua
                                </Button>
                            </div>
                        </div>

                        {/* Cart Item List */}
                        <div>
                            {cart.map((item) => {
                                const displayPrice = getDisplayPrice(item);
                                const hasDiscount =
                                    item.discount_price &&
                                    item.discount_price > 0;
                                const isOutOfStock = item.stock <= 0;
                                const isQuantityExceedsStock =
                                    item.quantity > item.stock;
                                const errorMessage = errorMessages[item.id];
                                const isLoadingThisItem =
                                    loadingQuantity[item.id];

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-4 border-b flex flex-col sm:flex-row items-center ${
                                            isOutOfStock ||
                                            isQuantityExceedsStock
                                                ? "bg-red-50"
                                                : ""
                                        }`}
                                    >
                                        {/* Product Image */}
                                        <div className="w-24 h-24 flex-shrink-0 mb-4 sm:mb-0 relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className={`w-full h-full object-cover rounded-md ${
                                                    isOutOfStock
                                                        ? "opacity-50"
                                                        : ""
                                                }`}
                                            />
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                                    <span className="text-white text-xs font-bold">
                                                        HABIS
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow sm:ml-4 sm:mr-4 text-center sm:text-left">
                                            <Link
                                                to={`/products/${item.id}`}
                                                className="font-medium text-gray-900 hover:text-kj-red"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="mt-1">
                                                <span className="text-kj-red font-semibold">
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }
                                                    ).format(displayPrice)}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="ml-2 text-gray-500 font-semibold line-through text-sm">
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                            {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            }
                                                        ).format(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Stock Information */}
                                            <div className="mt-1 text-sm">
                                                <span
                                                    className={`${
                                                        item.stock <= 5
                                                            ? "text-red-600"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    Stok: {item.stock}
                                                </span>
                                                {item.stock <= 5 &&
                                                    item.stock > 0 && (
                                                        <span className="ml-1 text-red-600 font-medium">
                                                            (Terbatas!)
                                                        </span>
                                                    )}
                                            </div>

                                            {/* Error Message */}
                                            {errorMessage && (
                                                <div className="mt-2 flex items-center text-red-600 text-sm">
                                                    <AlertCircle
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    {errorMessage}
                                                </div>
                                            )}

                                            {/* Stock Warning */}
                                            {isQuantityExceedsStock && (
                                                <div className="mt-2 flex items-center text-red-600 text-sm">
                                                    <AlertCircle
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    Jumlah melebihi stok yang
                                                    tersedia
                                                </div>
                                            )}
                                        </div>

                                        {/* Quantity Control */}
                                        <div className="flex items-center mt-4 sm:mt-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-8 h-8 p-0 rounded-l-md rounded-r-none"
                                                onClick={() =>
                                                    handleQuantityUpdate(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    isOutOfStock ||
                                                    isLoadingThisItem
                                                }
                                            >
                                                <Minus size={16} />
                                            </Button>

                                            {/* Quantity Display dengan Spinner */}
                                            <div
                                                className={`w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white ${
                                                    isQuantityExceedsStock
                                                        ? "text-red-600 font-bold"
                                                        : ""
                                                }`}
                                            >
                                                {isLoadingThisItem ? (
                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin text-gray-500"
                                                    />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-8 h-8 p-0 rounded-r-md rounded-l-none"
                                                onClick={() =>
                                                    handleQuantityUpdate(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    isOutOfStock ||
                                                    item.quantity >=
                                                        item.stock ||
                                                    isLoadingThisItem
                                                }
                                            >
                                                <Plus size={16} />
                                            </Button>

                                            <div className="ml-4 text-kj-red font-semibold">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                ).format(
                                                    displayPrice * item.quantity
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-4 w-8 h-8 text-gray-400"
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                disabled={isLoadingThisItem}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Continue Shopping Button */}
                        <div className="p-4">
                            <Button
                                variant="outline"
                                asChild
                                className="border-kj-red text-kj-red hover:bg-kj-red hover:text-white"
                            >
                                <Link to="/products">
                                    <ChevronLeft size={16} className="mr-2" />
                                    Lanjutkan Belanja
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div
                        className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 sticky
                        top-6"
                    >
                        <div className="p-4 border-b">
                            <h2 className="font-medium">Ringkasan Pesanan</h2>
                        </div>

                        <div className="p-4">
                            {/* Stock Warning for Checkout */}
                            {cart.some(
                                (item) =>
                                    item.stock <= 0 ||
                                    item.quantity > item.stock
                            ) && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-center text-red-800 text-sm">
                                        <AlertCircle
                                            size={16}
                                            className="mr-2"
                                        />
                                        <span className="font-medium">
                                            Beberapa produk tidak dapat dipesan
                                        </span>
                                    </div>
                                    <p className="text-red-700 text-xs mt-1">
                                        Periksa dan sesuaikan jumlah sebelum
                                        melanjutkan
                                    </p>
                                </div>
                            )}

                            {/* Price Summary */}
                            <div className="mb-4 flex justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-bold text-kj-red">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            {/* Checkout Button */}
                            <Button
                                className="w-full bg-kj-red hover:bg-kj-darkred text-white disabled:bg-gray-400"
                                asChild={
                                    !cart.some(
                                        (item) =>
                                            item.stock <= 0 ||
                                            item.quantity > item.stock
                                    )
                                }
                                disabled={cart.some(
                                    (item) =>
                                        item.stock <= 0 ||
                                        item.quantity > item.stock
                                )}
                            >
                                {cart.some(
                                    (item) =>
                                        item.stock <= 0 ||
                                        item.quantity > item.stock
                                ) ? (
                                    <span>Sesuaikan Produk</span>
                                ) : (
                                    <Link to="/checkout">
                                        Lanjutkan ke Pembayaran
                                    </Link>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
