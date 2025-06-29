import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Truck,
    Clock,
    CheckCircle,
    AlertCircle,
    Star,
    Copy,
    Trash,
    Loader,
    PackageCheck,
    XCircle,
} from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { useReviewStore } from "@/stores/reviewStore";
import { OrderDetailTabSkeleton } from "@/components/skeleton/OrderDetailTabSkeleton";
import { useToast } from "@/components/ui/use-toast";

interface OrderDetailTabProps {
    orderId?: string;
    onBack?: () => void;
}

const OrderDetailTab: React.FC<OrderDetailTabProps> = ({ orderId, onBack }) => {
    const { id } = useParams<{ id: string }>();
    const orderIdToUse = orderId || id;

    const {
        currentOrder,
        isLoading,
        error,
        fetchOrderDetail,
        clearError,
        clearCurrentOrder,
    } = useOrderStore();
    const { getReviewByOrderItemId, deleteReview } = useReviewStore();
    const { toast } = useToast();
    const [copiedTracking, setCopiedTracking] = useState(false);
    const [reviews, setReviews] = useState<{
        [key: string]: { exists: boolean; reviewId?: string };
    }>({});

    useEffect(() => {
        console.log("OrderDetailTab mounted with:", {
            orderId,
            urlId: id,
            orderIdToUse,
        });

        if (orderIdToUse) {
            console.log("Fetching order detail for:", orderIdToUse);
            fetchOrderDetail(orderIdToUse);
        } else {
            console.error("No order ID provided");
        }

        return () => {
            clearCurrentOrder();
        };
    }, [orderIdToUse, fetchOrderDetail, clearCurrentOrder]);

    useEffect(() => {
        const checkReviews = async () => {
            if (currentOrder?.order_items) {
                const reviewStatus: {
                    [key: string]: { exists: boolean; reviewId?: string };
                } = {};
                for (const item of currentOrder.order_items) {
                    const review = await getReviewByOrderItemId(item.id);
                    reviewStatus[item.id] = {
                        exists: !!review,
                        reviewId: review?.id,
                    };
                }
                setReviews(reviewStatus);
            }
        };
        checkReviews();
    }, [currentOrder, getReviewByOrderItemId]);

    useEffect(() => {
        if (error) {
            console.error("Order detail error:", error);
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleDeleteReview = async (
        reviewId: string,
        orderItemId: string
    ) => {
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

    if (!orderIdToUse) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-8">
                    <AlertCircle
                        size={48}
                        className="mx-auto text-red-400 mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Order ID Tidak Ditemukan
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Tidak ada ID pesanan yang diberikan.
                    </p>
                    <Button onClick={onBack} variant="outline">
                        Kembali ke Daftar Pesanan
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <OrderDetailTabSkeleton />;
    }

    if (error || !currentOrder) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="mr-2"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Kembali
                    </Button>
                </div>

                <div className="text-center py-8">
                    <AlertCircle
                        size={48}
                        className="mx-auto text-red-400 mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {error || "Pesanan tidak ditemukan"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Pesanan yang Anda cari tidak dapat ditemukan atau sudah
                        tidak tersedia.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Order ID: {orderIdToUse}
                    </p>
                    <Button onClick={onBack} variant="outline">
                        Kembali ke Daftar Pesanan
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusDate = (status: string) => {
        if (!currentOrder?.order_status_history) return null;

        const statusEntry = currentOrder.order_status_history.find(
            (history) => history.status === status
        );
        return statusEntry ? statusEntry.created_at : null;
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
                return <Clock className="text-yellow-700" size={20} />;

            case "CONFIRMED":
                return <CheckCircle className="text-blue-700" size={20} />;

            case "PROCESSING":
                return <Loader className="text-purple-700" size={20} />;

            case "SHIPPED":
                return <Truck className="text-indigo-700" size={20} />;

            case "DELIVERED":
                return <PackageCheck className="text-green-700" size={20} />;

            case "CANCELLED":
                return <XCircle className="text-red-700" size={20} />;

            default:
                return <Clock className="text-gray-700" size={20} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-700 border-yellow-700";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-700 border-blue-700";
            case "PROCESSING":
                return "bg-purple-100 text-purple-700 border-purple-700";
            case "SHIPPED":
                return "bg-indigo-100 text-indigo-700 border-indigo-700";
            case "DELIVERED":
                return "bg-green-100 text-green-700 border-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700 border-red-700";
            default:
                return "bg-gray-100 text-gray-700 border-gray-700";
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const copyTrackingNumber = async (trackingNumber: string) => {
        try {
            await navigator.clipboard.writeText(trackingNumber);
            setCopiedTracking(true);
            setTimeout(() => setCopiedTracking(false), 2000);
        } catch (error) {
            console.error("Failed to copy tracking number:", error);
        }
    };

    const calculateSubtotal = () => {
        if (!currentOrder?.order_items) return 0;
        return currentOrder.order_items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="mr-2"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Kembali
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">
                                Pesanan #{currentOrder.id.toUpperCase()}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Dibuat pada{" "}
                                {formatDate(currentOrder.created_at)}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center ${getStatusColor(
                            currentOrder.status
                        )}`}
                    >
                        {getStatusIcon(currentOrder.status)}
                        <span className="ml-2">
                            {getStatusLabel(currentOrder.status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4 flex items-center">
                            <Package size={20} className="mr-2" />
                            Item Pesanan
                        </h2>

                        <div className="space-y-4">
                            {currentOrder.order_items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-4 border rounded-lg"
                                >
                                    {item.product?.product_image &&
                                        item.product.product_image.length >
                                            0 && (
                                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                <img
                                                    src={
                                                        item.product.product_image.find(
                                                            (img) => img.is_main
                                                        )?.image_url ||
                                                        item.product
                                                            .product_image[0]
                                                            ?.image_url
                                                    }
                                                    alt={
                                                        item.product?.name ||
                                                        "Product"
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                    <div
                                        className={`flex-grow ${
                                            item.product?.product_image &&
                                            item.product.product_image.length >
                                                0
                                                ? "ml-4"
                                                : ""
                                        }`}
                                    >
                                        <Link
                                            to={`/products/${item.product_id}`}
                                            className="font-medium text-gray-900 hover:text-kj-red"
                                        >
                                            {item.product?.name ||
                                                "Product Name"}
                                        </Link>
                                        {item.product?.description && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.product.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-500">
                                                {item.quantity} ×{" "}
                                                {formatCurrency(item.price)}
                                            </span>
                                            <span className="font-medium text-kj-red">
                                                {formatCurrency(
                                                    item.price * item.quantity
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {currentOrder.status === "DELIVERED" && (
                                        <div className="flex gap-2 ml-4">
                                            {reviews[item.id]?.exists && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            reviews[item.id]
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
                                                        reviews[item.id]?.exists
                                                            ? `/edit-review/${
                                                                  reviews[
                                                                      item.id
                                                                  ].reviewId
                                                              }`
                                                            : `/add-review/${item.id}/${item.product_id}`
                                                    }
                                                >
                                                    <Star
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    {reviews[item.id]?.exists
                                                        ? "Edit"
                                                        : "Nilai"}
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">
                            Status Pesanan
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle
                                        size={16}
                                        className="text-green-600"
                                    />
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">
                                        Pesanan Dibuat
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {getStatusDate("PENDING")
                                            ? formatDate(
                                                  getStatusDate("PENDING")!
                                              )
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            {currentOrder.status !== "PENDING" &&
                                getStatusDate("CONFIRMED") && (
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle
                                                size={16}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium">
                                                Pesanan Dikonfirmasi
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {getStatusDate("CONFIRMED")
                                                    ? formatDate(
                                                          getStatusDate(
                                                              "CONFIRMED"
                                                          )!
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                                currentOrder.status
                            ) &&
                                getStatusDate("PROCESSING") && (
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle
                                                size={16}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium">
                                                Pesanan Diproses
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {getStatusDate("PROCESSING")
                                                    ? formatDate(
                                                          getStatusDate(
                                                              "PROCESSING"
                                                          )!
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {["SHIPPED", "DELIVERED"].includes(
                                currentOrder.status
                            ) &&
                                getStatusDate("SHIPPED") && (
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle
                                                size={16}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium">
                                                Pesanan Dikirim
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {getStatusDate("SHIPPED")
                                                    ? formatDate(
                                                          getStatusDate(
                                                              "SHIPPED"
                                                          )!
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {currentOrder.status === "DELIVERED" &&
                                getStatusDate("DELIVERED") && (
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle
                                                size={16}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium">
                                                Pesanan Diterima
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {getStatusDate("DELIVERED")
                                                    ? formatDate(
                                                          getStatusDate(
                                                              "DELIVERED"
                                                          )!
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-medium mb-4">
                            Ringkasan Pesanan
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>
                                    {formatCurrency(calculateSubtotal())}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Ongkos Kirim
                                </span>
                                <span>
                                    {formatCurrency(
                                        currentOrder.total_amount -
                                            calculateSubtotal()
                                    )}
                                </span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-kj-red">
                                        {formatCurrency(
                                            currentOrder.total_amount
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentOrder.address && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                                <MapPin size={20} className="mr-2" />
                                Alamat Pengiriman
                            </h3>

                            <div className="space-y-2">
                                <p className="font-medium">
                                    {currentOrder.address.recipient}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {currentOrder.address.full_address}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {currentOrder.address.village},{" "}
                                    {currentOrder.address.subdistrict}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {currentOrder.address.city},{" "}
                                    {currentOrder.address.province}
                                </p>
                                {currentOrder.address.postal_code && (
                                    <p className="text-sm text-gray-600">
                                        {currentOrder.address.postal_code}
                                    </p>
                                )}
                            </div>

                            {currentOrder.shipping?.tracking_number && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">
                                                Nomor Resi
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {
                                                    currentOrder.shipping
                                                        .tracking_number
                                                }
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyTrackingNumber(
                                                    currentOrder.shipping!
                                                        .tracking_number!
                                                )
                                            }
                                        >
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                    {copiedTracking && (
                                        <p className="text-xs text-green-600 mt-1">
                                            Berhasil disalin!
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentOrder.shipping?.estimated_delivery && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">
                                        Estimasi Tiba
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        {formatDate(
                                            currentOrder.shipping
                                                .estimated_delivery
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {currentOrder.payment && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                                <CreditCard size={20} className="mr-2" />
                                Informasi Pembayaran
                            </h3>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Metode
                                    </span>
                                    <span className="capitalize">
                                        {currentOrder.payment.method}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Status
                                    </span>
                                    <span
                                        className={`capitalize ${
                                            currentOrder.payment.status ===
                                            "paid"
                                                ? "text-green-600"
                                                : currentOrder.payment
                                                      .status === "pending"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {currentOrder.payment.status}
                                    </span>
                                </div>
                                {currentOrder.payment.transaction_id && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            ID Transaksi
                                        </span>
                                        <span className="text-sm font-mono">
                                            {
                                                currentOrder.payment
                                                    .transaction_id
                                            }
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Tanggal
                                    </span>
                                    <span className="text-sm">
                                        {formatDate(
                                            currentOrder.payment.created_at
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {currentOrder.status === "DELIVERED" && (
                            <div className="flex flex-col gap-3">
                                {reviews[currentOrder.order_items[0]?.id]
                                    ?.exists && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                        onClick={() =>
                                            handleDeleteReview(
                                                reviews[
                                                    currentOrder.order_items[0]
                                                        .id
                                                ].reviewId!,
                                                currentOrder.order_items[0].id
                                            )
                                        }
                                    >
                                        <Trash size={16} className="mr-2" />
                                        Hapus Penilaian
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                    asChild
                                >
                                    <Link
                                        to={
                                            reviews[
                                                currentOrder.order_items[0]?.id
                                            ]?.exists
                                                ? `/edit-review/${
                                                      reviews[
                                                          currentOrder
                                                              .order_items[0].id
                                                      ].reviewId
                                                  }`
                                                : `/add-review/${currentOrder.order_items[0]?.id}/${currentOrder.order_items[0]?.product_id}`
                                        }
                                    >
                                        <Star size={16} className="mr-2" />
                                        {reviews[
                                            currentOrder.order_items[0]?.id
                                        ]?.exists
                                            ? "Edit Penilaian"
                                            : "Beri Penilaian"}
                                    </Link>
                                </Button>
                            </div>
                        )}

                        <Button className="w-full">Hubungi Penjual</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailTab;
