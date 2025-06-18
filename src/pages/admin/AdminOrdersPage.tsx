import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ShoppingCart,
    Search,
    Eye,
    Package,
    TrendingUp,
    Clock,
    AlertCircle,
    Loader2,
    RefreshCw,
} from "lucide-react";
import { useAdminOrderStore } from "@/stores/admin/adminOrderStore";

const AdminOrdersPage = () => {
    const navigate = useNavigate();
    const {
        orders,
        stats,
        isLoading,
        error,
        searchTerm,
        statusFilter,
        fetchAllOrders,
        fetchOrderStats,
        setSearchTerm,
        setStatusFilter,
        getFilteredOrders,
        clearError,
        refreshData,
    } = useAdminOrderStore();

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const filteredOrders = getFilteredOrders();

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleRefresh = () => {
        refreshData();
    };

    const statsCards = [
        {
            title: "Total Pesanan",
            value: stats?.totalOrders?.toLocaleString("id-ID") || "0",
            icon: ShoppingCart,
            color: "text-blue-600",
        },
        {
            title: "Pesanan Hari Ini",
            value: stats?.todayOrders?.toLocaleString("id-ID") || "0",
            icon: Clock,
            color: "text-green-600",
        },
        {
            title: "Sedang Diproses",
            value: stats?.processingOrders?.toLocaleString("id-ID") || "0",
            icon: Package,
            color: "text-orange-600",
        },
        {
            title: "Pendapatan Hari Ini",
            value: stats ? formatCurrency(stats.todayRevenue) : "Rp 0",
            icon: TrendingUp,
            color: "text-purple-600",
        },
    ];

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                        Pesanan
                    </h2>
                </div>
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <p className="font-medium">Terjadi Kesalahan</p>
                        </div>
                        <p className="text-red-600 text-sm mt-2">{error}</p>
                        <Button
                            onClick={() => {
                                clearError();
                                fetchAllOrders();
                                fetchOrderStats();
                            }}
                            className="mt-4"
                            size="sm"
                        >
                            Coba Lagi
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                    Pesanan
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        disabled={isLoading}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${
                                isLoading ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Package className="h-4 w-4 mr-2" />
                        Export Pesanan
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <Card
                        key={index}
                        className="border-none shadow-sm hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                </div>
                                <stat.icon
                                    className={`h-8 w-8 ${stat.color}`}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Orders Table */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="text-lg sm:text-xl">
                            Data Pesanan ({filteredOrders.length})
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Select
                                value={statusFilter}
                                onValueChange={(value: any) =>
                                    setStatusFilter(value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Menunggu
                                    </SelectItem>
                                    <SelectItem value="CONFIRMED">
                                        Dikonfirmasi
                                    </SelectItem>
                                    <SelectItem value="PROCESSING">
                                        Diproses
                                    </SelectItem>
                                    <SelectItem value="SHIPPED">
                                        Dikirim
                                    </SelectItem>
                                    <SelectItem value="DELIVERED">
                                        Terkirim
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Dibatalkan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari pesanan..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Memuat data pesanan...</span>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== "ALL"
                                    ? "Tidak ada pesanan yang sesuai dengan filter"
                                    : "Belum ada pesanan"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[100px]">
                                            ID Pesanan
                                        </TableHead>
                                        <TableHead className="min-w-[150px]">
                                            Pelanggan
                                        </TableHead>
                                        <TableHead className="min-w-[200px]">
                                            Produk
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            Total
                                        </TableHead>
                                        <TableHead className="min-w-[100px]">
                                            Status
                                        </TableHead>
                                        <TableHead className="min-w-[150px]">
                                            Tanggal
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            Pembayaran
                                        </TableHead>
                                        <TableHead className="min-w-[80px]">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                {order.id.slice(0, 8)}...
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {order.user?.name ||
                                                            "N/A"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.user?.email ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {order.order_item
                                                        ?.slice(0, 2)
                                                        .map((item, idx) => (
                                                            <p
                                                                key={idx}
                                                                className="font-medium text-sm"
                                                            >
                                                                {item.product
                                                                    ?.name ||
                                                                    "Produk tidak diketahui"}
                                                                {item.quantity >
                                                                    1 &&
                                                                    ` (${item.quantity}x)`}
                                                            </p>
                                                        ))}
                                                    {(order.order_item
                                                        ?.length || 0) > 2 && (
                                                        <p className="text-xs text-gray-500">
                                                            +
                                                            {(order.order_item
                                                                ?.length || 0) -
                                                                2}{" "}
                                                            produk lainnya
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-semibold">
                                                    {formatCurrency(
                                                        order.total_amount
                                                    )}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusColor(
                                                        order.status
                                                    )}
                                                >
                                                    {getStatusLabel(
                                                        order.status
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(order.created_at)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {order.payment.method || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/orders/${order.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrdersPage;
