import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    Truck,
    CheckCircle,
    Clock,
    Star,
    AlertCircle,
} from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { OrdersTabSkeleton } from "@/components/skeleton/AccountSkeletons";

const OrdersTab = () => {
    const { orders, isLoading, error, fetchUserOrders, clearError } =
        useOrderStore();

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Menunggu";
            case "CONFIRMED":
                return "Dikonfirmasi";
            case "PROCESSING":
                return "Diproses";
            case "SHIPPED":
                return "Dikirim";
            case "DELIVERED":
                return "Diterima";
            case "CANCELLED":
                return "Dibatalkan";
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
            case "CONFIRMED":
                return <Clock className="text-yellow-500" size={18} />;
            case "PROCESSING":
                return <Clock className="text-orange-500" size={18} />;
            case "SHIPPED":
                return <Truck className="text-blue-500" size={18} />;
            case "DELIVERED":
                return <CheckCircle className="text-green-500" size={18} />;
            case "CANCELLED":
                return <AlertCircle className="text-red-500" size={18} />;
            default:
                return <Clock size={18} />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return <OrdersTabSkeleton />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-medium">Pesanan Saya</h2>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                    <div className="flex">
                        <AlertCircle className="text-red-400" size={20} />
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {orders.length > 0 ? (
                <div className="divide-y">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                    <h3 className="font-medium">
                                        Pesanan #{order.id.toUpperCase()}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(order.created_at)}
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
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </div>
                            </div>

                            {order.order_items &&
                                order.order_items.length > 0 && (
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        {order.order_items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center py-2"
                                            >
                                                {/* Only show image if it exists */}
                                                {item.product?.product_image &&
                                                    item.product.product_image
                                                        .length > 0 && (
                                                        <div className="w-16 h-16 rounded-md overflow-hidden">
                                                            <img
                                                                src={
                                                                    item.product.product_image.find(
                                                                        (img) =>
                                                                            img.is_main
                                                                    )
                                                                        ?.image_url ||
                                                                    item.product
                                                                        .product_image[0]
                                                                        ?.image_url
                                                                }
                                                                alt={
                                                                    item.product
                                                                        ?.name ||
                                                                    "Product"
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                <div
                                                    className={`flex-grow ${
                                                        item.product
                                                            ?.product_image &&
                                                        item.product
                                                            .product_image
                                                            .length > 0
                                                            ? "ml-3"
                                                            : ""
                                                    }`}
                                                >
                                                    <Link
                                                        to={`/products/${item.product_id}`}
                                                        className="font-medium hover:text-kj-red"
                                                    >
                                                        {item.product?.name ||
                                                            "Product Name"}
                                                    </Link>
                                                    <div className="text-sm text-gray-500">
                                                        Jumlah: {item.quantity}{" "}
                                                        x{" "}
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </div>
                                                </div>

                                                {order.status ===
                                                    "DELIVERED" && (
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
                                )}

                            <div className="flex justify-between mt-4">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/account/orders/${order.id}`}>
                                        Detail Pesanan
                                    </Link>
                                </Button>

                                {(order.status === "PROCESSING" ||
                                    order.status === "SHIPPED") && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                        asChild
                                    >
                                        <Link
                                            to={`/account/orders/${order.id}/track`}
                                        >
                                            Lacak Pesanan
                                        </Link>
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
