import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

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
    const { logout } = useAuthStore();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsRead = (id: number) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    // Handler untuk logout
    const handleLogout = async () => {
        try {
            await logout();
            // Redirect ke home page setelah logout berhasil
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-end">
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

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default AdminHeader;
