import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useAddressStore } from "@/stores/addressStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
    CreditCard,
    CheckCircle2,
    Plus,
    MapPin,
    ChevronLeft,
    ShoppingCart,
} from "lucide-react";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, totalPrice, getDisplayPrice } = useCartStore();
    const { addresses, defaultAddress, fetchAddresses } = useAddressStore();
    const { createOrder, isProcessing, error } = useCheckoutStore();
    const { user } = useAuthStore();
    const { toast } = useToast();

    const [paymentMethod, setPaymentMethod] = useState<string>("bank-transfer");
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const [walletMethod, setWalletMethod] = useState<string>("gopay");
    const [shippingMethod, setShippingMethod] = useState<string>("regular");
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<string>("");

    // Shipping costs
    const shippingCosts = {
        regular: 50000,
        express: 100000,
    };

    // Total to pay
    const totalToPay =
        totalPrice +
        (shippingMethod === "regular"
            ? shippingCosts.regular
            : shippingCosts.express);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    useEffect(() => {
        if (defaultAddress && !selectedAddressId) {
            setSelectedAddressId(defaultAddress.id);
        }
    }, [defaultAddress, selectedAddressId]);

    // Show error toast when checkout error occurs
    useEffect(() => {
        if (error) {
            toast({
                title: "Terjadi kesalahan",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    const handlePlaceOrder = async () => {
        // Basic validation
        if (!selectedAddressId) {
            toast({
                title: "Alamat belum dipilih",
                description: "Mohon pilih alamat pengiriman terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        if (!user) {
            toast({
                title: "Anda belum login",
                description: "Silakan login terlebih dahulu",
                variant: "destructive",
            });
            navigate("/login");
            return;
        }

        const selectedAddress = addresses.find(
            (addr) => addr.id === selectedAddressId
        );
        if (!selectedAddress) {
            toast({
                title: "Alamat tidak valid",
                description: "Alamat yang dipilih tidak ditemukan",
                variant: "destructive",
            });
            return;
        }

        const currentTotal = totalToPay;
        setPaidAmount(currentTotal);

        // Prepare order data dengan address_id reference
        const orderData = {
            total_amount: currentTotal,
            status: "PENDING" as const,
            shipping_data: {
                address_id: selectedAddressId, // Reference ke address table
                estimated_delivery: calculateEstimatedDelivery(),
            },
            order_items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: getDisplayPrice(item),
            })),
            payment_data: {
                method: getPaymentMethodName(),
                amount: currentTotal,
                status: "PENDING" as const,
            },
        };

        try {
            const result = await createOrder(orderData);

            if (result.success && result.orderId) {
                setOrderId(result.orderId);
                setIsOrderPlaced(true);

                toast({
                    title: "Pesanan berhasil dibuat!",
                    description: "Silakan lakukan pembayaran sesuai instruksi",
                });
            }
        } catch (err) {
            console.error("Order creation failed:", err);
        }
    };

    const calculateEstimatedDelivery = () => {
        const days = shippingMethod === "regular" ? 7 : 2;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        return deliveryDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    const getPaymentMethodName = () => {
        switch (paymentMethod) {
            case "bank-transfer":
                return "Transfer Bank";
            case "e-wallet":
                return `E-Wallet (${walletMethod.toUpperCase()})`;
            case "credit-card":
                return "Kartu Kredit";
            default:
                return "Transfer Bank";
        }
    };

    const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
    );

    // If cart is empty and not after order placement, redirect to cart page
    if (cart.length === 0 && !isOrderPlaced) {
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
                        Anda perlu menambahkan produk ke keranjang sebelum
                        checkout.
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

    // If order has been placed
    if (isOrderPlaced) {
        return (
            <div className="container-custom py-16 max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <CheckCircle2
                        size={64}
                        className="mx-auto text-green-500 mb-4"
                    />
                    <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                        Pesanan Berhasil!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Terima kasih atas pesanan Anda. Kami telah mengirimkan
                        detail pesanan ke email Anda.
                    </p>

                    <div className="bg-gray-50 rounded-md p-4 mb-6 text-left">
                        <h3 className="font-medium mb-2">Detail Pesanan</h3>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>ID Pesanan:</strong> #
                            {orderId.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Tanggal:</strong>{" "}
                            {new Date().toLocaleDateString("id-ID")}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Metode Pembayaran:</strong>{" "}
                            {getPaymentMethodName()}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Total:</strong>{" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(paidAmount)}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button asChild>
                            <Link to="/">Kembali ke Beranda</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/account">Lihat Pesanan Saya</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">
                Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping & Payment Form */}
                <div className="lg:col-span-2">
                    {/* Address Selection */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-medium">Alamat Pengiriman</h2>
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/account">
                                    <Plus size={16} className="mr-1" />
                                    Tambah Alamat
                                </Link>
                            </Button>
                        </div>
                        <div className="p-4">
                            {addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <MapPin
                                        size={48}
                                        className="mx-auto text-gray-400 mb-4"
                                    />
                                    <p className="text-gray-500 mb-4">
                                        Belum ada alamat tersimpan
                                    </p>
                                    <Button asChild>
                                        <Link to="/account">
                                            Tambah Alamat Baru
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                selectedAddressId === address.id
                                                    ? "border-kj-red bg-red-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() =>
                                                setSelectedAddressId(address.id)
                                            }
                                        >
                                            <div className="flex items-start">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={address.id}
                                                    checked={
                                                        selectedAddressId ===
                                                        address.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedAddressId(
                                                            address.id
                                                        )
                                                    }
                                                    className="h-4 w-4 text-kj-red focus:ring-kj-red border-gray-300 mt-1"
                                                />
                                                <div className="ml-3 flex-grow">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-medium">
                                                            {address.recipient}
                                                        </h3>
                                                        {address.is_default && (
                                                            <span className="bg-kj-red text-white text-xs px-2 py-1 rounded-full">
                                                                Utama
                                                            </span>
                                                        )}
                                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                            {address.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">
                                                        {address.full_address}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {address.village},{" "}
                                                        {address.subdistrict},{" "}
                                                        {address.city},{" "}
                                                        {address.province}{" "}
                                                        {address.zip_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b">
                            <h2 className="font-medium">Metode Pengiriman</h2>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="shipping-regular"
                                        name="shipping"
                                        value="regular"
                                        checked={shippingMethod === "regular"}
                                        onChange={() =>
                                            setShippingMethod("regular")
                                        }
                                        className="h-4 w-4 text-kj-red focus:ring-kj-red border-gray-300"
                                    />
                                    <label
                                        htmlFor="shipping-regular"
                                        className="ml-3 flex flex-grow justify-between"
                                    >
                                        <span className="font-medium text-gray-900">
                                            Pengiriman Reguler (3-7 hari)
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(shippingCosts.regular)}
                                        </span>
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="shipping-express"
                                        name="shipping"
                                        value="express"
                                        checked={shippingMethod === "express"}
                                        onChange={() =>
                                            setShippingMethod("express")
                                        }
                                        className="h-4 w-4 text-kj-red focus:ring-kj-red border-gray-300"
                                    />
                                    <label
                                        htmlFor="shipping-express"
                                        className="ml-3 flex flex-grow justify-between"
                                    >
                                        <span className="font-medium text-gray-900">
                                            Pengiriman Ekspres (1-2 hari)
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(shippingCosts.express)}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="font-medium">Metode Pembayaran</h2>
                        </div>
                        <div className="p-4">
                            <Tabs
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            >
                                <TabsList className="grid grid-cols-3 mb-4">
                                    <TabsTrigger value="bank-transfer">
                                        Transfer Bank
                                    </TabsTrigger>
                                    <TabsTrigger value="e-wallet">
                                        E-Wallet
                                    </TabsTrigger>
                                    <TabsTrigger value="credit-card">
                                        Kartu Kredit
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="bank-transfer">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-medium mb-3">
                                            Instruksi Transfer Bank
                                        </h3>
                                        <ol className="list-decimal pl-5 space-y-2">
                                            <li>
                                                Selesaikan pemesanan, Anda akan
                                                menerima email dengan detail
                                                pembayaran
                                            </li>
                                            <li>
                                                Transfer ke rekening bank yang
                                                tertera sesuai jumlah yang
                                                ditampilkan
                                            </li>
                                            <li>
                                                Konfirmasi pembayaran Anda
                                                melalui link di email atau
                                                halaman akun Anda
                                            </li>
                                            <li>
                                                Pesanan Anda akan diproses
                                                setelah pembayaran dikonfirmasi
                                            </li>
                                        </ol>
                                        <div className="mt-4 border-t pt-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Bank BCA
                                                    </span>
                                                    <span>1234567890</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Bank Mandiri
                                                    </span>
                                                    <span>0987654321</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Bank BNI
                                                    </span>
                                                    <span>1122334455</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="e-wallet">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-medium mb-3">
                                            Pilih E-Wallet
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="wallet-gopay"
                                                    name="wallet"
                                                    value="gopay"
                                                    checked={
                                                        walletMethod === "gopay"
                                                    }
                                                    onChange={(e) =>
                                                        setWalletMethod(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-4 w-4 text-kj-red focus:ring-kj-red border-gray-300"
                                                />
                                                <label
                                                    htmlFor="wallet-gopay"
                                                    className="ml-3 font-medium text-gray-900"
                                                >
                                                    GoPay
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="wallet-ovo"
                                                    name="wallet"
                                                    value="ovo"
                                                    checked={
                                                        walletMethod === "ovo"
                                                    }
                                                    onChange={(e) =>
                                                        setWalletMethod(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-4 w-4 text-kj-red focus:ring-kj-red border-gray-300"
                                                />
                                                <label
                                                    htmlFor="wallet-ovo"
                                                    className="ml-3 font-medium text-gray-900"
                                                >
                                                    OVO
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="wallet-dana"
                                                    name="wallet"
                                                    value="dana"
                                                    checked={
                                                        walletMethod === "dana"
                                                    }
                                                    onChange={(e) =>
                                                        setWalletMethod(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-4 w-4 text-kj-red focus:ring-kj-red border-gray-300"
                                                />
                                                <label
                                                    htmlFor="wallet-dana"
                                                    className="ml-3 font-medium text-gray-900"
                                                >
                                                    DANA
                                                </label>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">
                                            Anda akan diarahkan ke halaman
                                            pembayaran setelah menekan tombol
                                            "Pesan Sekarang"
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="credit-card">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-medium mb-3">
                                            Detail Kartu Kredit
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="card-number"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Nomor Kartu
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        id="card-number"
                                                        placeholder="1234 5678 9012 3456"
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <CreditCard
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="expiry"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Tanggal Kadaluarsa
                                                    </label>
                                                    <Input
                                                        id="expiry"
                                                        placeholder="MM / YY"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="cvv"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        CVV
                                                    </label>
                                                    <Input
                                                        id="cvv"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="card-name"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Nama pada Kartu
                                                </label>
                                                <Input
                                                    id="card-name"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
                        <div className="p-4 border-b">
                            <h2 className="font-medium">Ringkasan Pesanan</h2>
                        </div>

                        <div className="p-4">
                            {/* Selected Address Display */}
                            {selectedAddress && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-sm mb-1">
                                        Dikirim ke:
                                    </h3>
                                    <p className="text-sm font-medium">
                                        {selectedAddress.recipient}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedAddress.full_address}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedAddress.village},{" "}
                                        {selectedAddress.subdistrict},{" "}
                                        {selectedAddress.city}
                                    </p>
                                </div>
                            )}

                            {/* Item List */}
                            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start"
                                    >
                                        <div className="w-16 h-16 rounded-md overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <div className="font-medium text-sm line-clamp-1">
                                                {item.name}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                Jumlah: {item.quantity}
                                            </div>
                                            <div className="text-kj-red font-medium text-sm">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                ).format(
                                                    getDisplayPrice(item) *
                                                        item.quantity
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Details */}
                            <div className="space-y-2 py-3 border-t border-b">
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
                                        }).format(
                                            shippingMethod === "regular"
                                                ? shippingCosts.regular
                                                : shippingCosts.express
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-3 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-kj-red">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(totalToPay)}
                                </span>
                            </div>

                            <Button
                                className="w-full mt-6 bg-kj-red hover:bg-kj-darkred text-white"
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || !selectedAddressId}
                            >
                                {isProcessing
                                    ? "Memproses..."
                                    : "Pesan Sekarang"}
                            </Button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Dengan menekan tombol "Pesan Sekarang", Anda
                                menyetujui Syarat dan Ketentuan serta Kebijakan
                                Privasi kami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
