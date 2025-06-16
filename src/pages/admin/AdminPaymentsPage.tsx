import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CreditCard,
    Banknote,
    Download,
    Search,
    Filter,
    RefreshCw,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

const AdminPaymentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const paymentStats = [
        {
            title: "Total Pembayaran Hari Ini",
            value: "Rp 45.750.000",
            icon: DollarSign,
            trend: "+12%",
            color: "text-green-600",
        },
        {
            title: "Pembayaran Pending",
            value: "Rp 8.250.000",
            icon: AlertCircle,
            trend: "5 transaksi",
            color: "text-yellow-600",
        },
        {
            title: "Pembayaran Berhasil",
            value: "Rp 125.500.000",
            icon: CheckCircle,
            trend: "+8% dari minggu lalu",
            color: "text-green-600",
        },
        {
            title: "Total Refund",
            value: "Rp 2.100.000",
            icon: RefreshCw,
            trend: "3 refund",
            color: "text-red-600",
        },
    ];

    const recentPayments = [
        {
            id: "PAY001",
            orderId: "ORD001",
            customer: "John Doe",
            amount: "Rp 4.500.000",
            method: "Transfer Bank",
            status: "Berhasil",
            date: "2024-01-15 10:30",
            statusColor: "bg-green-100 text-green-800",
        },
        {
            id: "PAY002",
            orderId: "ORD002",
            customer: "Jane Smith",
            amount: "Rp 2.750.000",
            method: "E-Wallet",
            status: "Pending",
            date: "2024-01-15 09:15",
            statusColor: "bg-yellow-100 text-yellow-800",
        },
        {
            id: "PAY003",
            orderId: "ORD003",
            customer: "Bob Wilson",
            amount: "Rp 6.200.000",
            method: "Kartu Kredit",
            status: "Berhasil",
            date: "2024-01-14 16:45",
            statusColor: "bg-green-100 text-green-800",
        },
        {
            id: "PAY004",
            orderId: "ORD004",
            customer: "Alice Brown",
            amount: "Rp 1.850.000",
            method: "Transfer Bank",
            status: "Gagal",
            date: "2024-01-14 14:20",
            statusColor: "bg-red-100 text-red-800",
        },
    ];

    const exportPayments = () => {
        const csvContent = `ID Pembayaran,ID Pesanan,Pelanggan,Jumlah,Metode,Status,Tanggal
${recentPayments
    .map(
        (payment) =>
            `${payment.id},${payment.orderId},${payment.customer},${payment.amount},${payment.method},${payment.status},${payment.date}`
    )
    .join("\n")}`;

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "laporan-pembayaran.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                    Manajemen Pembayaran
                </h2>
                <Button
                    onClick={exportPayments}
                    className="bg-kj-red hover:bg-kj-red/90"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export Laporan
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentStats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {stat.value}
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

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Semua Pembayaran</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="success">Berhasil</TabsTrigger>
                    <TabsTrigger value="failed">Gagal</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Riwayat Pembayaran
                            </CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari pembayaran..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
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
                                        {recentPayments.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="p-2 font-medium">
                                                    {payment.id}
                                                </td>
                                                <td className="p-2">
                                                    {payment.orderId}
                                                </td>
                                                <td className="p-2">
                                                    {payment.customer}
                                                </td>
                                                <td className="p-2 font-medium">
                                                    {payment.amount}
                                                </td>
                                                <td className="p-2">
                                                    {payment.method}
                                                </td>
                                                <td className="p-2">
                                                    <Badge
                                                        className={
                                                            payment.statusColor
                                                        }
                                                    >
                                                        {payment.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-2 text-gray-600">
                                                    {payment.date}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                Pembayaran Pending
                            </h3>
                            <p className="text-gray-600">
                                Menampilkan hanya pembayaran yang masih pending
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="success">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6 text-center">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                Pembayaran Berhasil
                            </h3>
                            <p className="text-gray-600">
                                Menampilkan hanya pembayaran yang berhasil
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="failed">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                Pembayaran Gagal
                            </h3>
                            <p className="text-gray-600">
                                Menampilkan hanya pembayaran yang gagal
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminPaymentsPage;
