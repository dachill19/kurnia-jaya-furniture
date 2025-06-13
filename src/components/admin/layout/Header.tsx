import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminHeader = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "Stok produk Sofa Modern hampir habis",
            isRead: false,
        },
        {
            id: 2,
            message: "5 pesanan baru memerlukan perhatian",
            isRead: false,
        },
        { id: 3, message: "Laporan penjualan mingguan siap", isRead: true },
    ]);

    const navigate = useNavigate();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsRead = (id: number) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-8 bg-gray-50"
                        placeholder="Cari..."
                        type="search"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 bg-kj-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Tidak ada notifikasi
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`p-3 cursor-pointer ${
                                        notification.isRead ? "" : "bg-kj-red/5"
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div>
                                        <p
                                            className={`text-sm ${
                                                notification.isRead
                                                    ? ""
                                                    : "font-medium"
                                            }`}
                                        >
                                            {notification.message}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                        {notifications.length > 0 && (
                            <DropdownMenuItem
                                className="p-2 text-center text-sm text-kj-red cursor-pointer hover:bg-kj-red/5"
                                onClick={() => navigate("/admin/notifications")}
                            >
                                Lihat semua notifikasi
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <User className="h-5 w-5" />
                            <span>Admin</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate("/admin/profile")}
                        >
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate("/admin/settings")}
                        >
                            Pengaturan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate("/admin/logout")}
                        >
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default AdminHeader;
