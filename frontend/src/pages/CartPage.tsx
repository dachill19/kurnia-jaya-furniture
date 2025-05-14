import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ChevronLeft } from "lucide-react";

const CartPage = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    } = useCart();

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
                                    className="text-gray-500 hover:text-white"
                                    onClick={clearCart}
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Hapus Semua
                                </Button>
                            </div>
                        </div>

                        {/* Cart Item List */}
                        <div>
                            {cart.map((item) => (
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
                                        <div className="text-kj-red font-semibold mt-1">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(item.price)}
                                        </div>
                                    </div>

                                    {/* Quantity Control */}
                                    <div className="flex items-center mt-4 sm:mt-0">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                            {item.quantity}
                                        </div>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                        <div className="ml-4 text-kj-red font-semibold">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(
                                                item.price * item.quantity
                                            )}
                                        </div>

                                        <button
                                            className="ml-4 p-1 text-gray-400 hover:text-kj-red"
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
