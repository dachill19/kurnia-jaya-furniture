import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    User,
    MapPin,
    ShoppingBag,
    Heart,
    Settings,
    ArrowLeft,
    LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

import ProfileTab from "@/components/main/account/ProfileTab";
import AddressTab from "@/components/main/account/AddressTab";
import OrdersTab from "@/components/main/account/OrdersTab";
import WishlistTab from "@/components/main/account/WishlistTab";
import EditAddressTab from "@/components/main/account/EditAddressTab";
import AddAddressTab from "@/components/main/account/AddAddressTab";
import SettingsTab from "@/components/main/account/SettingsTab";
import { Address } from "@/stores/addressStore";

const AccountPage: React.FC = () => {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profile");
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null
    );

    // Handler untuk edit alamat
    const handleEditAddress = (address: Address) => {
        setSelectedAddress(address);
        setActiveTab("editAddress");
    };

    // Handler untuk tambah alamat
    const handleAddAddress = () => {
        setActiveTab("addAddress");
    };

    // Handler untuk kembali dari edit/add address
    const handleBackToAddresses = () => {
        setSelectedAddress(null);
        setActiveTab("addresses");
    };

    // Handler untuk logout
    const handleLogout = async () => {
        try {
            await logout();
            // Redirect ke home page setelah logout berhasil
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Menu navigasi
    const menuItems = [
        {
            id: "profile",
            label: "Profil Saya",
            icon: User,
        },
        {
            id: "addresses",
            label: "Alamat",
            icon: MapPin,
        },
        {
            id: "orders",
            label: "Pesanan",
            icon: ShoppingBag,
        },
        {
            id: "wishlist",
            label: "Wishlist",
            icon: Heart,
        },
        {
            id: "settings",
            label: "Pengaturan",
            icon: Settings,
        },
    ];

    // Loading state jika user belum tersedia
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kj-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-kj-red rounded-full flex items-center justify-center text-white font-medium">
                                        {user?.name?.charAt(0)?.toUpperCase() ||
                                            user?.email
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                            "U"}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {user?.name || "User"}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <nav className="p-2">
                                {/* Menu items */}
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        activeTab === item.id ||
                                        (item.id === "addresses" &&
                                            (activeTab === "editAddress" ||
                                                activeTab === "addAddress"));

                                    return (
                                        <Button
                                            key={item.id}
                                            variant={
                                                isActive ? "default" : "ghost"
                                            }
                                            className={`w-full justify-start mb-1 ${
                                                isActive
                                                    ? "bg-kj-red hover:bg-kj-darkred"
                                                    : "text-gray-600 "
                                            }`}
                                            onClick={() =>
                                                setActiveTab(item.id)
                                            }
                                        >
                                            <Icon size={16} className="mr-3" />
                                            {item.label}
                                        </Button>
                                    );
                                })}

                                {/* Logout Button */}
                                <div className="mt-1 pt-2 border-t">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} className="mr-3" />
                                        Logout
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Profile Tab */}
                        {activeTab === "profile" && <ProfileTab />}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <AddressTab
                                onEditAddress={handleEditAddress}
                                onAddAddress={handleAddAddress}
                            />
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && <OrdersTab />}

                        {/* Wishlist Tab */}
                        {activeTab === "wishlist" && <WishlistTab />}

                        {/* Edit Address Tab */}
                        {activeTab === "editAddress" && selectedAddress && (
                            <EditAddressTab
                                selectedAddress={selectedAddress}
                                onBack={handleBackToAddresses}
                            />
                        )}

                        {/* Add Address Tab */}
                        {activeTab === "addAddress" && (
                            <AddAddressTab onBack={handleBackToAddresses} />
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && <SettingsTab />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
