import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    Eye,
    DollarSign,
    Calendar,
    RefreshCw,
    Loader2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

// Import stores
import { useAdminOrderStore } from "@/stores/admin/adminOrderStore";
import { useUserStore } from "@/stores/admin/adminUserStore";
import { useProductStore } from "@/stores/productStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useAdminPaymentStore } from "@/stores/admin/adminPaymentStore";

const Dashboard = () => {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        orders,
        stats: orderStats,
        fetchAllOrders,
        fetchOrderStats,
        getFilteredOrders,
    } = useAdminOrderStore();

    const {
        users,
        stats: userStats,
        fetchUsers,
        fetchUserStats,
    } = useUserStore();

    const {
        products,
        categories,
        getAllProducts,
        error: productError,
    } = useProductStore();

    const {
        payments,
        stats: paymentStats,
        refreshData: refreshPaymentData,
    } = useAdminPaymentStore();

    const { isLoadingKey } = useLoadingStore();

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                await Promise.all([
                    fetchAllOrders(),
                    fetchOrderStats(),
                    fetchUsers(),
                    fetchUserStats(),
                    getAllProducts(),
                    refreshPaymentData(),
                ]);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        };

        loadDashboardData();
    }, [
        fetchAllOrders,
        fetchOrderStats,
        fetchUsers,
        fetchUserStats,
        getAllProducts,
        refreshPaymentData,
    ]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                fetchAllOrders(),
                fetchOrderStats(),
                fetchUsers(),
                fetchUserStats(),
                getAllProducts(),
                refreshPaymentData(),
            ]);
        } catch (error) {
            console.error("Error refreshing dashboard data:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getTodayRevenue = () => {
        const today = new Date();
        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
        );

        const todayPayments = payments.filter((payment) => {
            const paymentDate = new Date(payment.created_at);
            return (
                paymentDate >= startOfDay &&
                paymentDate <= endOfDay &&
                payment.status === "SUCCESS"
            );
        });

        return todayPayments.reduce(
            (total, payment) => total + payment.amount,
            0
        );
    };

    const getTodayOrdersCount = () => {
        const today = new Date();
        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
        );

        return orders.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= startOfDay && orderDate <= endOfDay;
        }).length;
    };

    const getRevenueData = () => {
        const months = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            );
            const monthName = date.toLocaleDateString("id-ID", {
                month: "short",
            });

            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );

            const monthPayments = payments.filter((payment) => {
                const paymentDate = new Date(payment.created_at);
                return (
                    paymentDate >= monthStart &&
                    paymentDate <= monthEnd &&
                    payment.status === "SUCCESS"
                );
            });

            const revenue = monthPayments.reduce(
                (sum, payment) => sum + payment.amount,
                0
            );

            months.push({
                month: monthName,
                revenue: revenue,
            });
        }

        return months;
    };

    const getCustomerData = () => {
        const months = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            );
            const monthName = date.toLocaleDateString("id-ID", {
                month: "short",
            });

            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );

            const newCustomers = users.filter((user) => {
                const userDate = new Date(user.created_at);
                return userDate >= monthStart && userDate <= monthEnd;
            });

            months.push({
                month: monthName,
                customers: newCustomers.length,
            });
        }

        return months;
    };

    const getLowStockProducts = () => {
        return products
            .filter((product) => product.stock <= 10)
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 6)
            .map((product) => ({
                id: product.id,
                name: product.name,
                stock: product.stock,
                minStock: 5,
                category: product.category?.name || "Tanpa Kategori",
            }));
    };

    const getRecentOrders = () => {
        return orders.slice(0, 5).map((order) => ({
            id: order.id,
            customer: order.user?.name || order.user?.email || "Unknown",
            product: order.order_item?.[0]?.product?.name || "Multiple Items",
            total: `Rp ${order.total_amount.toLocaleString("id-ID")}`,
            status: order.status.toLowerCase(),
            date: order.created_at,
            itemCount: order.order_item?.length || 0,
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const todayRevenue = getTodayRevenue();
    const todayOrdersCount = getTodayOrdersCount();

    const isLoading =
        isLoadingKey("admin-orders-fetch") ||
        isLoadingKey("fetch-users") ||
        isLoadingKey("all-products") ||
        isLoadingKey("fetch-products") ||
        isRefreshing;

    const statsCards = [
        {
            title: "Total Pengguna",
            value: userStats?.totalUsers?.toLocaleString("id-ID") || "0",
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Total Produk",
            value: (products?.length || 0).toLocaleString("id-ID"),
            icon: Package,
            color: "text-green-600",
        },
        {
            title: "Pesanan Hari Ini",
            value: todayOrdersCount.toLocaleString("id-ID"),
            icon: ShoppingCart,
            color: "text-orange-600",
        },
        {
            title: "Pendapatan Hari Ini",
            value: formatCurrency(todayRevenue),
            icon: DollarSign,
            color: "text-purple-600",
        },
    ];

    const revenueData = getRevenueData();
    const customerData = getCustomerData();
    const lowStockProducts = getLowStockProducts();
    const recentOrders = getRecentOrders();

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "processing":
                return "bg-purple-100 text-purple-800";
            case "shipped":
                return "bg-indigo-100 text-indigo-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Menunggu";
            case "confirmed":
                return "Dikonfirmasi";
            case "processing":
                return "Diproses";
            case "shipped":
                return "Dikirim";
            case "delivered":
                return "Selesai";
            case "cancelled":
                return "Dibatal";
            default:
                return status;
        }
    };

    const getStockStatus = (stock, minStock) => {
        if (stock === 0)
            return { label: "Habis", color: "bg-red-100 text-red-800" };
        if (stock <= minStock / 2)
            return { label: "Sangat Rendah", color: "bg-red-100 text-red-800" };
        if (stock <= minStock)
            return { label: "Rendah", color: "bg-yellow-100 text-yellow-800" };
        return { label: "Normal", color: "bg-green-100 text-green-800" };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                    Dashboard
                </h1>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                isRefreshing ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Pendapatan Bulanan
                        </CardTitle>
                        <CardDescription>
                            Grafik pendapatan dalam 6 bulan terakhir
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            `${(value / 1000000).toFixed(0)}M`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            `Rp ${(
                                                Number(value) / 1000000
                                            ).toFixed(1)}M`,
                                            "Pendapatan",
                                        ]}
                                    />
                                    <Bar dataKey="revenue" fill="#C30000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Chart */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Pelanggan Baru
                        </CardTitle>
                        <CardDescription>
                            Jumlah pelanggan baru dalam 6 bulan terakhir
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={customerData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [
                                            Number(value),
                                            "Pelanggan",
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="customers"
                                        stroke="#C30000"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                Peringatan Stok Rendah
                            </CardTitle>
                            <CardDescription>
                                Produk yang perlu segera di-restock
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => navigate("/admin/products")}
                            size="sm"
                            className="bg-kj-red hover:bg-kj-darkred"
                        >
                            Kelola Produk
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {lowStockProducts.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">
                                    Semua produk memiliki stok yang cukup
                                </p>
                            </div>
                        ) : (
                            lowStockProducts.map((product) => {
                                const stockStatus = getStockStatus(
                                    product.stock,
                                    product.minStock
                                );
                                const stockPercentage = Math.min(
                                    (product.stock / product.minStock) * 100,
                                    100
                                );

                                return (
                                    <div key={product.id} className="space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {product.category} • Stok:{" "}
                                                    {product.stock}
                                                </p>
                                            </div>
                                            <Badge
                                                className={`text-xs whitespace-nowrap ${stockStatus.color}`}
                                            >
                                                {stockStatus.label}
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={stockPercentage}
                                            className="h-2"
                                        />
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Pesanan Terbaru
                            </CardTitle>
                            <CardDescription>
                                Pesanan yang masuk terbaru
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/admin/orders")}
                            className="flex items-center gap-1"
                        >
                            <Eye className="h-3 w-3" />
                            Lihat Semua
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Belum ada pesanan</p>
                            </div>
                        ) : (
                            recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <p className="font-medium text-sm truncate">
                                                {order.id.slice(0, 8)}...
                                            </p>
                                            <Badge
                                                className={`text-xs w-fit ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">
                                            {order.customer}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {order.itemCount > 1
                                                ? `${order.product} +${
                                                      order.itemCount - 1
                                                  } item lain`
                                                : order.product}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">
                                            {order.total}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/orders/${order.id}`
                                                )
                                            }
                                            className="text-xs h-auto p-1 text-kj-red hover:text-kj-darkred"
                                        >
                                            Detail
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
