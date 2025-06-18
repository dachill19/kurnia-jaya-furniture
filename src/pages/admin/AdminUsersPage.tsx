import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users,
    Search,
    Mail,
    Phone,
    Download,
    RefreshCw,
    AlertCircle,
    UserPlus,
    Activity,
    Loader2,
} from "lucide-react";
import { useUserStore } from "@/stores/admin/adminUserStore";
import { useAuthStore } from "@/stores/authStore";

const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const {
        users,
        stats,
        isLoading,
        error,
        searchUsers,
        exportUsers,
        refreshData,
    } = useUserStore();

    const { isAdmin } = useAuthStore();

    const filteredUsers = searchUsers(searchTerm);

    useEffect(() => {
        if (isAdmin()) {
            refreshData();
        }
    }, [isAdmin, refreshData]);

    const userStats = [
        {
            title: "Total Pengguna",
            value: stats.totalUsers,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Sign In Hari Ini",
            value: "2",
            icon: Activity,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Bergabung Bulan Ini",
            value: stats.newThisMonth,
            icon: UserPlus,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
    ];

    const getStatusBadge = (role: string) => {
        const colors = {
            ADMIN: "bg-blue-100 text-blue-700",
            USER: "bg-green-100 text-green-700",
        };
        return (
            colors[role as keyof typeof colors] || "bg-gray-100 text-gray-700"
        );
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

    const formatLastSignIn = (lastSignIn?: string) => {
        if (!lastSignIn) return "Belum pernah";
        return formatDate(lastSignIn);
    };

    const handleRefresh = () => {
        refreshData();
    };

    if (!isAdmin()) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Access Denied
                    </h3>
                    <p className="text-gray-600">
                        Anda tidak memiliki akses untuk melihat halaman ini.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                    Pengguna
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
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
                        onClick={exportUsers}
                        className="bg-kj-red hover:bg-kj-red/90 flex-1 sm:flex-none"
                        disabled={isLoading || users.length === 0}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {userStats.map((stat, index) => (
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
                                            stat.value.toLocaleString("id-ID")
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

            {/* Search and Filter */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="text-lg sm:text-xl">
                            Data Pengguna
                        </CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari pengguna..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">
                                Memuat data pengguna...
                            </span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-center text-gray-500">
                                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>
                                    {searchTerm
                                        ? "Tidak ada pengguna yang ditemukan"
                                        : "Belum ada data pengguna"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[100px]">
                                            User ID
                                        </TableHead>
                                        <TableHead className="min-w-[150px]">
                                            Nama
                                        </TableHead>
                                        <TableHead className="min-w-[200px]">
                                            Email
                                        </TableHead>
                                        <TableHead className="min-w-[150px]">
                                            Telepon
                                        </TableHead>
                                        <TableHead className="min-w-[100px]">
                                            Role
                                        </TableHead>
                                        <TableHead className="min-w-[150px]">
                                            Tanggal Bergabung
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.id}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.name || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm truncate">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm">
                                                        {user.phone || "-"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusBadge(
                                                        user.role
                                                    )}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(user.created_at)}
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

export default AdminUsersPage;
