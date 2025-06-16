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
    Trash,
} from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { useReviewStore } from "@/stores/reviewStore";
import { OrdersTabSkeleton } from "@/components/skeleton/AccountSkeletons";
import { useToast } from "@/components/ui/use-toast";

interface OrdersTabProps {
    onViewOrderDetail?: (orderId: string) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ onViewOrderDetail }) => {
    const { orders, isLoading, error, fetchUserOrders, clearError } = useOrderStore();
    const { getReviewByOrderItemId, deleteReview } = useReviewStore();
    const { toast } = useToast();
    const [reviews, setReviews] = useState<{ [key: string]: { exists: boolean; reviewId?: string } }>({});

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    useEffect(() => {
        const checkReviews = async () => {
            const reviewStatus: { [key: string]: { exists: boolean; reviewId?: string } } = {};
            for (const order of orders) {
                for (const item of order.order_items || []) {
                    const review = await getReviewByOrderItemId(item.id);
                    reviewStatus[item.id] = {
                        exists: !!review,
                        reviewId: review?.id,
                    };
                }
            }
            setReviews(reviewStatus);
        };
        if (orders.length > 0) {
            checkReviews();
        }
    }, [orders, getReviewByOrderItemId]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleDeleteReview = async (reviewId: string, orderItemId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
            return;
        }

        try {
            await deleteReview(reviewId);
            setReviews((prev) => ({
                ...prev,
                [orderItemId]: { exists: false },
            }));
            toast({
                title: "Success",
                description: "Ulasan berhasil dihapus.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Gagal menghapus ulasan.",
                variant: "destructive",
            });
        }
    };

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

    const handleViewDetail = (orderId: string) => {
        if (onViewOrderDetail) {
            onViewOrderDetail(orderId);
        }
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
                                                    <div className="flex gap-2">
                                                        {reviews[item.id]
                                                            ?.exists && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                                                onClick={() =>
                                                                    handleDeleteReview(
                                                                        reviews[
                                                                            item
                                                                                .id
                                                                        ]
                                                                            .reviewId!,
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                Hapus
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                                            asChild
                                                        >
                                                            <Link
                                                                to={
                                                                    reviews[
                                                                        item.id
                                                                    ]?.exists
                                                                        ? `/edit-review/${reviews[item.id].reviewId}`
                                                                        : `/add-review/${item.id}/${item.product_id}`
                                                                }
                                                            >
                                                                <Star
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                {reviews[item.id]
                                                                    ?.exists
                                                                    ? "Edit"
                                                                    : "Nilai"}
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetail(order.id)}
                                >
                                    Detail Pesanan
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
