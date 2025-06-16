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

    // Filter users based on search term
    const filteredUsers = searchUsers(searchTerm);

    // Load data on component mount
    useEffect(() => {
        if (isAdmin()) {
            refreshData();
        }
    }, [isAdmin, refreshData]);

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

    // Check if user is admin
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
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Pengguna
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {isLoading
                                        ? "..."
                                        : stats.totalUsers.toLocaleString(
                                              "id-ID"
                                          )}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Sign In Hari Ini
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {isLoading
                                        ? "..."
                                        : stats.activeToday.toLocaleString(
                                              "id-ID"
                                          )}
                                </p>
                            </div>
                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <div className="h-3 w-3 bg-green-600 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Bergabung Bulan Ini
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {isLoading
                                        ? "..."
                                        : stats.newThisMonth.toLocaleString(
                                              "id-ID"
                                          )}
                                </p>
                            </div>
                            <div className="h-8 w-8 bg-kj-red/10 rounded-full flex items-center justify-center">
                                <div className="h-3 w-3 bg-kj-red rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                        <div className="flex items-center justify-center h-32">
                            <div className="flex items-center gap-2 text-gray-500">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Memuat data pengguna...</span>
                            </div>
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
                                        <TableHead className="min-w-[150px]">
                                            Terakhir Sign In
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
                                            <TableCell className="text-sm">
                                                {formatLastSignIn(
                                                    user.last_sign_in
                                                )}
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
