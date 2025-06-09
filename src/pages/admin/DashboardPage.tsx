// src/components/admin/layout/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Users, Package, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {user?.name || user?.email}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            <a
                                href="/admin/dashboard"
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <BarChart3 size={20} className="mr-3" />
                                Dashboard
                            </a>
                            <a
                                href="/admin/products"
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <Package size={20} className="mr-3" />
                                Products
                            </a>
                            <a
                                href="/admin/users"
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <Users size={20} className="mr-3" />
                                Users
                            </a>
                            <a
                                href="/admin/settings"
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <Settings size={20} className="mr-3" />
                                Settings
                            </a>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
