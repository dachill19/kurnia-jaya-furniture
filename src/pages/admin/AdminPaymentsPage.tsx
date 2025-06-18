import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CreditCard,
    Download,
    Search,
    RefreshCw,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { useAdminPaymentStore } from "@/stores/admin/adminPaymentStore";

const AdminPaymentsPage = () => {
    const {
        payments,
        stats,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        getFilteredPayments,
        exportPaymentsCSV,
        clearError,
        refreshData,
    } = useAdminPaymentStore();

    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const filteredPayments = getFilteredPayments();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "SUCCESS":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "FAILED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "SUCCESS":
                return "Berhasil";
            case "PENDING":
                return "Pending";
            case "FAILED":
                return "Gagal";
            case "REFUNDED":
                return "Refund";
            default:
                return status;
        }
    };

    const getFilteredPaymentsByTab = () => {
        let filtered = filteredPayments;

        switch (activeTab) {
            case "pending":
                filtered = filtered.filter((p) => p.status === "PENDING");
                break;
            case "success":
                filtered = filtered.filter((p) => p.status === "SUCCESS");
                break;
            case "failed":
                filtered = filtered.filter((p) => p.status === "FAILED");
                break;
            default:
                break;
        }

        return filtered;
    };

    const handleRefresh = () => {
        refreshData();
    };

    const paymentStats = [
        {
            title: "Total Pembayaran Hari Ini",
            value: stats ? formatCurrency(stats.todayTotal) : "Rp 0",
            icon: DollarSign,
            trend: stats ? stats.weeklyGrowth : "0%",
            color: "text-green-600",
        },
        {
            title: "Pembayaran Pending",
            value: stats ? formatCurrency(stats.pendingAmount) : "Rp 0",
            icon: AlertCircle,
            trend: stats ? `${stats.pendingCount} transaksi` : "0 transaksi",
            color: "text-yellow-600",
        },
        {
            title: "Pembayaran Berhasil",
            value: stats ? formatCurrency(stats.successAmount) : "Rp 0",
            icon: CheckCircle,
            trend: stats ? stats.successGrowth : "0%",
            color: "text-green-600",
        },
        {
            title: "Pembayaran Gagal",
            value: stats ? formatCurrency(stats.failedAmount) : "Rp 0",
            icon: RefreshCw,
            trend: stats ? `${stats.failedCount} transaksi` : "0 transaksi",
            color: "text-red-600",
        },
    ];

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                        Manajemen Pembayaran
                    </h2>
                </div>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2 text-red-600">
                            Error
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={clearError} variant="outline">
                            Tutup
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
                    Manajemen Pembayaran
                </h2>
                <div className="flex gap-2">
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
                    <Button
                        onClick={exportPaymentsCSV}
                        className="bg-kj-red hover:bg-kj-red/90"
                        disabled={payments.length === 0}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Laporan
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentStats.map((stat, index) => (
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
                                    <p className={`text-xs ${stat.color}`}>
                                        {stat.trend}
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

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Semua Pembayaran</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="success">Berhasil</TabsTrigger>
                    <TabsTrigger value="failed">Gagal</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <CreditCard className="h-5 w-5" />
                                    Riwayat Pembayaran
                                </CardTitle>
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari pembayaran..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="ml-2">
                                        Memuat data pembayaran...
                                    </span>
                                </div>
                            ) : getFilteredPaymentsByTab().length === 0 ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">
                                        Tidak ada data pembayaran
                                    </h3>
                                    <p className="text-gray-600">
                                        {activeTab === "all"
                                            ? "Belum ada pembayaran yang tercatat"
                                            : `Tidak ada pembayaran dengan status ${getStatusText(
                                                  activeTab.toUpperCase()
                                              )}`}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">
                                                    ID Pembayaran
                                                </th>
                                                <th className="text-left p-2">
                                                    ID Pesanan
                                                </th>
                                                <th className="text-left p-2">
                                                    Pelanggan
                                                </th>
                                                <th className="text-left p-2">
                                                    Jumlah
                                                </th>
                                                <th className="text-left p-2">
                                                    Metode
                                                </th>
                                                <th className="text-left p-2">
                                                    Status
                                                </th>
                                                <th className="text-left p-2">
                                                    Tanggal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getFilteredPaymentsByTab().map(
                                                (payment) => (
                                                    <tr
                                                        key={payment.id}
                                                        className="border-b hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <td className="p-2 font-medium">
                                                            {payment.id}
                                                        </td>
                                                        <td className="p-2">
                                                            {payment.order
                                                                ?.id || "-"}
                                                        </td>
                                                        <td className="p-2">
                                                            <div>
                                                                <div className="font-medium">
                                                                    {payment
                                                                        .order
                                                                        ?.user
                                                                        ?.name ||
                                                                        "N/A"}
                                                                </div>
                                                                <div className="text-gray-500 text-xs">
                                                                    {payment
                                                                        .order
                                                                        ?.user
                                                                        ?.email ||
                                                                        ""}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-2 font-medium">
                                                            {formatCurrency(
                                                                payment.amount
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            {payment.method}
                                                        </td>
                                                        <td className="p-2">
                                                            <Badge
                                                                className={getStatusBadgeColor(
                                                                    payment.status
                                                                )}
                                                            >
                                                                {getStatusText(
                                                                    payment.status
                                                                )}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-2 text-gray-600">
                                                            {formatDate(
                                                                payment.created_at
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminPaymentsPage;
