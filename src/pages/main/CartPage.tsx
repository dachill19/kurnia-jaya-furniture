import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { useEffect } from "react";
import { CartPageSkeleton } from "@/components/main/skeleton/CartPageSkeleton";

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

    // Fetch cart data when component mounts
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Show skeleton while loading
    if (isLoadingKey("cart-fetch")) {
        return <CartPageSkeleton />;
    }

    // Shipping Cost (fixed for now)
    const shippingCost = 50000;

    // Calculate total to be paid
    const totalToPay = totalPrice + shippingCost;

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

                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 border-b flex flex-col sm:flex-row items-center"
                                    >
                                        {/* Product Image */}
                                        <div className="w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
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
                                        </div>

                                        {/* Quantity Control */}
                                        <div className="flex items-center mt-4 sm:mt-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-8 h-8 p-0 rounded-l-md rounded-r-none"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                <Minus size={16} />
                                            </Button>
                                            <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                                                {item.quantity}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-8 h-8 p-0 rounded-r-md rounded-l-none"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
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
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                        <div className="p-4 border-b">
                            <h2 className="font-medium">Ringkasan Pesanan</h2>
                        </div>

                        <div className="p-4">
                            {/* Price Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(totalPrice)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Pengiriman
                                    </span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(shippingCost)}
                                    </span>
                                </div>
                                <div className="pt-3 border-t flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold text-kj-red">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(totalToPay)}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                className="w-full bg-kj-red hover:bg-kj-darkred text-white"
                                asChild
                            >
                                <Link to="/checkout">
                                    Lanjutkan ke Pembayaran
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
