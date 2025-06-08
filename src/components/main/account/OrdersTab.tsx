import { useState, useEffect } from "react"; // Added useState, useEffect
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, CheckCircle, Clock, Star } from "lucide-react";
import { useLoadingStore } from "@/stores/loadingStore"; // Added
import { OrdersTabSkeleton } from "@/components/main/skeleton/AccountSkeletons";

// Mock data - in a real app this would come from API
const mockOrders = [
    {
        id: "ORD-001",
        date: "2023-10-15",
        total: 6500000,
        status: "delivered",
        items: [
            {
                id: "sofa-premium-01",
                name: "Premium Comfort Sofa",
                quantity: 1,
                price: 4500000,
                image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
            },
            {
                id: "coffee-table-01",
                name: "Glass Top Coffee Table",
                quantity: 1,
                price: 1800000,
                image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=2070&auto=format&fit=crop",
            },
        ],
    },
    {
        id: "ORD-002",
        date: "2023-11-20",
        total: 6200000,
        status: "processing",
        items: [
            {
                id: "bed-premium-01",
                name: "King Size Wooden Bed",
                quantity: 1,
                price: 6200000,
                image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop",
            },
        ],
    },
];

const OrdersTab = () => {
    const { isLoadingKey } = useLoadingStore();
    const [orders, setOrders] = useState(mockOrders); // Replace with API call in real app
    const [isLoadingOrders, setIsLoadingOrders] = useState(true); // Simulate loading

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setIsLoadingOrders(false);
        }, 1000); // Mock delay
    }, []);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "processing":
                return "Diproses";
            case "shipped":
                return "Dikirim";
            case "delivered":
                return "Diterima";
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "processing":
                return <Clock className="text-orange-500" size={18} />;
            case "shipped":
                return <Truck className="text-blue-500" size={18} />;
            case "delivered":
                return <CheckCircle className="text-green-500" size={18} />;
            default:
                return <Clock size={18} />;
        }
    };

    if (isLoadingOrders) {
        return <OrdersTabSkeleton />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-medium">Pesanan Saya</h2>
            </div>

            {orders.length > 0 ? (
                <div className="divide-y">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                    <h3 className="font-medium">
                                        Pesanan #{order.id}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            order.date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center mt-2 md:mt-0">
                                    <div className="flex items-center mr-4">
                                        {getStatusIcon(order.status)}
                                        <span className="ml-1">
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <span className="font-medium text-kj-red">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(order.total)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center py-2"
                                    >
                                        <div className="w-16 h-16 rounded-md overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <Link
                                                to={`/products/${item.id}`}
                                                className="font-medium hover:text-kj-red"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="text-sm text-gray-500">
                                                Jumlah: {item.quantity} x{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                ).format(item.price)}
                                            </div>
                                        </div>

                                        {order.status === "delivered" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                            >
                                                <Star
                                                    size={16}
                                                    className="mr-1"
                                                />
                                                Nilai
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button variant="outline" size="sm">
                                    Detail Pesanan
                                </Button>

                                {order.status === "processing" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-kj-red border-kj-red"
                                    >
                                        Lacak Pesanan
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <ShoppingBag
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                    />
                    <h3 className="text-xl font-medium mb-2">
                        Belum ada pesanan
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Anda belum melakukan pemesanan apa pun.
                    </p>
                    <Button asChild>
                        <Link to="/products">Mulai Belanja</Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
