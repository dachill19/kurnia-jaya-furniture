import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    User,
    MapPin,
    ShoppingBag,
    Heart,
    Settings,
    ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

// Import semua komponen tab
import ProfileTab from "@/components/main/account/ProfileTab";
import AddressTab from "@/components/main/account/AddressTab";
import OrdersTab from "@/components/main/account/OrdersTab";
import WishlistTab from "@/components/main/account/WishlistTab";
import EditAddressTab from "@/components/main/account/EditAddressTab";
import SettingsTab from "@/components/main/account/SettingsTab";

interface AccountPageProps {
    apiService?: any; // Optional karena mungkin tidak semua tab memerlukan ini
    addToCart?: (item: any) => void; // Optional
}

const AccountPage: React.FC<AccountPageProps> = ({ apiService, addToCart }) => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profile");
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Handler untuk edit alamat
    const handleEditAddress = (address: any) => {
        setSelectedAddress(address);
        setActiveTab("editAddress");
    };

    // Handler untuk update alamat
    const handleUpdateAddress = async (addressData: any) => {
        try {
            if (apiService && selectedAddress) {
                await apiService.updateAddress(selectedAddress.id, addressData);
                // Kembali ke tab alamat setelah berhasil update
                setActiveTab("addresses");
            }
        } catch (error) {
            console.error("Gagal update alamat:", error);
            throw error;
        }
    };

    // Handler untuk kembali dari edit address
    const handleBackFromEditAddress = () => {
        setSelectedAddress(null);
        setActiveTab("addresses");
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
                                {/* Tombol kembali untuk edit address */}
                                {activeTab === "editAddress" && (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start mb-2"
                                        onClick={handleBackFromEditAddress}
                                    >
                                        <ArrowLeft size={16} className="mr-2" />
                                        Kembali ke Alamat
                                    </Button>
                                )}

                                {/* Menu items */}
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Button
                                            key={item.id}
                                            variant={
                                                activeTab === item.id
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className={`w-full justify-start mb-1 ${
                                                activeTab === item.id
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
                                apiService={apiService}
                                onEditAddress={handleEditAddress}
                            />
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && <OrdersTab />}

                        {/* Wishlist Tab */}
                        {activeTab === "wishlist" && (
                            <WishlistTab
                                addToCart={addToCart}
                                apiService={apiService}
                            />
                        )}

                        {/* Edit Address Tab */}
                        {activeTab === "editAddress" && selectedAddress && (
                            <EditAddressTab
                                selectedAddress={selectedAddress}
                                updateAddress={handleUpdateAddress}
                            />
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
