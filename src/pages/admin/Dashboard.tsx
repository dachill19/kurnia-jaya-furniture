import { useState } from "react";
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
import {
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    Eye,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
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

const Dashboard = () => {
    const navigate = useNavigate();

    // Mock data
    const stats = [
        {
            title: "Total Pengguna",
            value: "1,234",
            icon: Users,
            change: "+12%",
            trend: "up",
        },
        {
            title: "Total Produk",
            value: "567",
            icon: Package,
            change: "+8%",
            trend: "up",
        },
        {
            title: "Pesanan Hari Ini",
            value: "89",
            icon: ShoppingCart,
            change: "+23%",
            trend: "up",
        },
        {
            title: "Pendapatan Bulan Ini",
            value: "Rp 45.6M",
            icon: DollarSign,
            change: "+15%",
            trend: "up",
        },
    ];

    const revenueData = [
        { month: "Jan", revenue: 12000000 },
        { month: "Feb", revenue: 15000000 },
        { month: "Mar", revenue: 18000000 },
        { month: "Apr", revenue: 22000000 },
        { month: "Mei", revenue: 25000000 },
        { month: "Jun", revenue: 28000000 },
    ];

    const customerData = [
        { month: "Jan", customers: 120 },
        { month: "Feb", customers: 150 },
        { month: "Mar", customers: 180 },
        { month: "Apr", customers: 220 },
        { month: "Mei", customers: 250 },
        { month: "Jun", customers: 280 },
    ];

    const lowStockProducts = [
        { id: 1, name: "Kursi Kantor Executive", stock: 3, minStock: 10 },
        { id: 2, name: "Meja Makan Kayu Jati", stock: 1, minStock: 5 },
        { id: 3, name: "Sofa 3 Dudukan", stock: 2, minStock: 8 },
        { id: 4, name: "Lemari Pakaian 4 Pintu", stock: 0, minStock: 3 },
    ];

    const recentOrders = [
        {
            id: "ORD-001",
            customer: "Ahmad Santoso",
            product: "Kursi Kantor Executive",
            total: "Rp 2,500,000",
            status: "pending",
            date: "2024-01-15",
        },
        {
            id: "ORD-002",
            customer: "Siti Nurhaliza",
            product: "Meja Makan Set",
            total: "Rp 8,500,000",
            status: "shipped",
            date: "2024-01-15",
        },
        {
            id: "ORD-003",
            customer: "Budi Prakoso",
            product: "Sofa L-Shape",
            total: "Rp 12,000,000",
            status: "delivered",
            date: "2024-01-14",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStockStatus = (stock: number, minStock: number) => {
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-xl font-bold">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                                        )}
                                        <span
                                            className={`text-xs font-medium ${
                                                stat.trend === "up"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 bg-kj-red/10 rounded-full flex items-center justify-center">
                                    <stat.icon className="h-5 w-5 text-kj-red" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
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
                                        formatter={(value: any) => [
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
                <Card>
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
                                        formatter={(value: any) => [
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
                <Card>
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
                            onClick={() => navigate("/admin/restock")}
                            size="sm"
                            className="bg-kj-red hover:bg-kj-darkred"
                        >
                            Restock
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {lowStockProducts.map((product) => {
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
                                                Stok: {product.stock} / Min:{" "}
                                                {product.minStock}
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
                        })}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Pesanan Terbaru
                            </CardTitle>
                            <CardDescription>
                                Pesanan yang masuk hari ini
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
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <p className="font-medium text-sm">
                                            {order.id}
                                        </p>
                                        <Badge
                                            className={`text-xs w-fit ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">
                                        {order.customer}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {order.product}
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
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
