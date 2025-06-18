import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Package,
    User,
    CreditCard,
    MapPin,
    Clock,
    Phone,
    Mail,
    Loader2,
} from "lucide-react";
import { useAdminOrderStore } from "@/stores/admin/adminOrderStore";

const AdminOrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const {
        currentOrder,
        isLoading,
        error,
        fetchOrderDetail,
        updateOrderStatus,
        clearCurrentOrder,
        clearError,
    } = useAdminOrderStore();

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail(orderId);
        }

        // Cleanup when component unmounts
        return () => {
            clearCurrentOrder();
            clearError();
        };
    }, [orderId, fetchOrderDetail, clearCurrentOrder, clearError]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-700";
            case "PROCESSING":
                return "bg-purple-100 text-purple-700";
            case "SHIPPED":
                return "bg-indigo-100 text-indigo-700";
            case "DELIVERED":
                return "bg-green-100 text-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status: string) => {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeline = () => {
        if (!currentOrder) return [];

        // Get actual status history from order_status_history
        const statusHistory = currentOrder.order_status_history || [];

        // Create a map of status to date from history
        const statusDateMap = statusHistory.reduce((acc, history) => {
            acc[history.status] = history.created_at;
            return acc;
        }, {} as Record<string, string>);

        // Define the expected order flow
        const expectedStatuses = [
            { status: "PENDING", label: "Pesanan Dibuat" },
            { status: "CONFIRMED", label: "Pesanan Dikonfirmasi" },
            { status: "PROCESSING", label: "Sedang Diproses" },
            { status: "SHIPPED", label: "Pesanan Dikirim" },
            { status: "DELIVERED", label: "Pesanan Diterima" },
        ];

        const timeline = expectedStatuses.map(({ status, label }) => {
            const hasStatus = statusDateMap[status];
            const isCompleted = !!hasStatus;

            return {
                status: label,
                date: hasStatus ? statusDateMap[status] : "Pending",
                completed: isCompleted,
                originalStatus: status,
            };
        });

        // Handle cancelled status separately
        if (statusDateMap["CANCELLED"]) {
            timeline.push({
                status: "Pesanan Dibatalkan",
                date: statusDateMap["CANCELLED"],
                completed: true,
                originalStatus: "CANCELLED",
            });
        }

        return timeline;
    };

    const handleStatusUpdate = async (newStatus: any) => {
        if (!currentOrder) return;

        try {
            // Update the status
            await updateOrderStatus({
                orderId: currentOrder.id,
                newStatus: newStatus,
            });

            // Fetch fresh data after successful update
            await fetchOrderDetail(currentOrder.id);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Memuat detail pesanan...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/admin/orders")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button
                                onClick={() =>
                                    orderId && fetchOrderDetail(orderId)
                                }
                            >
                                Coba Lagi
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/admin/orders")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-gray-600">
                                Pesanan tidak ditemukan
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>
                <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                        Detail Pesanan {currentOrder.id}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                        <Badge className={getStatusColor(currentOrder.status)}>
                            {getStatusText(currentOrder.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                            {formatDate(currentOrder.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Detail Produk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {currentOrder.order_item?.map((item, index) => {
                                    // Pindahkan deklarasi mainImage ke dalam loop untuk setiap item
                                    const mainImage =
                                        item.product?.product_image?.find(
                                            (img) => img.is_main
                                        )?.image_url;

                                    return (
                                        <div key={item.id}>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {mainImage ? (
                                                        <img
                                                            src={mainImage}
                                                            alt={
                                                                item.product
                                                                    ?.name
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">
                                                        {item.product?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {item.product?.id}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                                                        <div>
                                                            <p className="text-sm">
                                                                Jumlah:{" "}
                                                                {item.quantity}
                                                            </p>
                                                            <p className="text-lg font-bold text-kj-red">
                                                                Rp{" "}
                                                                {item.price.toLocaleString(
                                                                    "id-ID"
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">
                                                                Subtotal
                                                            </p>
                                                            <p className="text-xl font-bold">
                                                                Rp{" "}
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toLocaleString(
                                                                    "id-ID"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {index <
                                                (currentOrder.order_item
                                                    ?.length || 0) -
                                                    1 && (
                                                <Separator className="my-4" />
                                            )}
                                        </div>
                                    );
                                })}
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">
                                        Total Pesanan:
                                    </span>
                                    <span className="text-2xl font-bold text-kj-red">
                                        Rp{" "}
                                        {currentOrder.total_amount.toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Pelanggan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Nama
                                    </p>
                                    <p className="font-semibold">
                                        {currentOrder.user?.name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        ID Pelanggan
                                    </p>
                                    <p className="font-semibold">
                                        {currentOrder.user?.id}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Email
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm">
                                            {currentOrder.user?.email || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Telepon
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm">
                                            {currentOrder.user?.phone || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    {currentOrder.shipping?.address && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Alamat Pengiriman
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="font-semibold">
                                        {
                                            currentOrder.shipping.address
                                                .recipient
                                        }
                                    </p>
                                    <p className="font-medium">
                                        {currentOrder.shipping.address.label}
                                    </p>
                                    <p>
                                        {
                                            currentOrder.shipping.address
                                                .full_address
                                        }
                                    </p>
                                    <p>
                                        {currentOrder.shipping.address.village},{" "}
                                        {
                                            currentOrder.shipping.address
                                                .subdistrict
                                        }
                                    </p>
                                    <p>
                                        {currentOrder.shipping.address.city},{" "}
                                        {currentOrder.shipping.address.province}
                                    </p>
                                    {currentOrder.shipping.address.zip_code && (
                                        <p>
                                            {
                                                currentOrder.shipping.address
                                                    .zip_code
                                            }
                                        </p>
                                    )}
                                </div>
                                {currentOrder.shipping.estimated_delivery && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                        <p className="text-sm font-medium text-blue-800">
                                            Estimasi Pengiriman:
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            {formatDate(
                                                currentOrder.shipping
                                                    .estimated_delivery
                                            )}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Status & Actions */}
                <div className="space-y-6">
                    {/* Payment Info */}
                    {currentOrder.payment && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Metode Pembayaran
                                    </p>
                                    <p className="font-semibold">
                                        {currentOrder.payment.method}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Status Pembayaran
                                    </p>
                                    <Badge
                                        className={
                                            currentOrder.payment.status ===
                                            "FAILED"
                                                ? "bg-red-100 text-red-700"
                                                : currentOrder.payment
                                                      .status === "SUCCESS"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }
                                    >
                                        {currentOrder.payment.status}
                                    </Badge>
                                </div>
                                {currentOrder.payment.transaction_id && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            ID Transaksi
                                        </p>
                                        <p className="text-sm font-mono">
                                            {
                                                currentOrder.payment
                                                    .transaction_id
                                            }
                                        </p>
                                    </div>
                                )}
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Pembayaran
                                    </p>
                                    <p className="text-xl font-bold text-kj-red">
                                        Rp{" "}
                                        {currentOrder.payment.amount.toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Timeline Pesanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {getTimeline().map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full mt-1 ${
                                                item.completed
                                                    ? item.originalStatus ===
                                                      "CANCELLED"
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                        <div className="flex-1">
                                            <p
                                                className={`text-sm font-medium ${
                                                    item.completed
                                                        ? item.originalStatus ===
                                                          "CANCELLED"
                                                            ? "text-red-700"
                                                            : "text-gray-900"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {item.status}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.date !== "Pending"
                                                    ? formatDate(item.date)
                                                    : "Pending"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {currentOrder.status === "PENDING" && (
                                <Button
                                    className="w-full bg-kj-red hover:bg-kj-red/90"
                                    onClick={() =>
                                        handleStatusUpdate("CONFIRMED")
                                    }
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Konfirmasi Pesanan"
                                    )}
                                </Button>
                            )}
                            {currentOrder.status === "CONFIRMED" && (
                                <Button
                                    className="w-full bg-kj-red hover:bg-kj-red/90"
                                    onClick={() =>
                                        handleStatusUpdate("PROCESSING")
                                    }
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Mulai Proses"
                                    )}
                                </Button>
                            )}
                            {currentOrder.status === "PROCESSING" && (
                                <Button
                                    className="w-full bg-kj-red hover:bg-kj-red/90"
                                    onClick={() =>
                                        handleStatusUpdate("SHIPPED")
                                    }
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Kirim Pesanan"
                                    )}
                                </Button>
                            )}
                            {currentOrder.status === "SHIPPED" && (
                                <Button
                                    className="w-full bg-kj-red hover:bg-kj-red/90"
                                    onClick={() =>
                                        handleStatusUpdate("DELIVERED")
                                    }
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Tandai Diterima"
                                    )}
                                </Button>
                            )}
                            <Button variant="outline" className="w-full">
                                Hubungi Pelanggan
                            </Button>
                            {(currentOrder.status === "PENDING" ||
                                currentOrder.status === "CONFIRMED") && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() =>
                                        handleStatusUpdate("CANCELLED")
                                    }
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Batalkan Pesanan"
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;
