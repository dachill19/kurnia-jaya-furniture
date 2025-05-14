import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    Package,
    Heart,
    Settings,
    LogOut,
    ShoppingBag,
    Truck,
    CheckCircle,
    Clock,
    Star,
    MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";

// Mock data - in a real app this would come from API
const mockOrders = [
    {
        id: "ORD-001",
        date: "2023-10-15",
        total: 6500000,
        status: "delivered",
        items: [
            {
                id: "sofa-premium-01",
                name: "Premium Comfort Sofa",
                quantity: 1,
                price: 4500000,
                image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
            },
            {
                id: "coffee-table-01",
                name: "Glass Top Coffee Table",
                quantity: 1,
                price: 1800000,
                image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=2070&auto=format&fit=crop",
            },
        ],
    },
    {
        id: "ORD-002",
        date: "2023-11-20",
        total: 6200000,
        status: "processing",
        items: [
            {
                id: "bed-premium-01",
                name: "King Size Wooden Bed",
                quantity: 1,
                price: 6200000,
                image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop",
            },
        ],
    },
];

const AccountPage = () => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<{ [key: string]: string }>({});
    const { user, logout, fetchProfile, updateProfile } = useAuth();
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
        {}
    );
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setFieldErrors({});
        try {
            await updateProfile(userData);
            setIsEditing(false);
        } catch (error) {
            const res = error.response?.data;
            if (res?.validationErrors) {
                // Buat objek error berdasarkan field
                const fieldErrs: { [key: string]: string } = {};
                res.validationErrors.forEach((err: any) => {
                    fieldErrs[err.path] = err.msg;
                });
                setFieldErrors(fieldErrs);
            } else if (res?.error) {
                setErrorMsg(res.error); // error umum
            } else {
                setErrorMsg("Login gagal. Coba lagi nanti.");
            }
        }
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/wishlist",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setWishlist(response.data);
            } catch (error) {
                console.error("Gagal mengambil wishlist:", error);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemoveWishlist = async (productId: string) => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/wishlist/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWishlist((prev) =>
                prev.filter((item) => item.product.id !== productId)
            );
        } catch (error) {
            console.error("Gagal menghapus dari wishlist:", error);
        }
    };

    const handleAddToCart = (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const product = item.product;
        const mainImage =
            product.images.find((img: any) => img.isMain) || product.images[0];

        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice ?? product.price,
            image: mainImage, // sesuaikan jika hanya perlu imageUrl: mainImage.imageUrl
        });

        toast({
            title: "Produk ditambahkan ke keranjang",
            description: product.name,
        });
    };

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "processing":
                return "Diproses";
            case "shipped":
                return "Dikirim";
            case "delivered":
                return "Diterima";
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "processing":
                return <Clock className="text-orange-500" size={18} />;
            case "shipped":
                return <Truck className="text-blue-500" size={18} />;
            case "delivered":
                return <CheckCircle className="text-green-500" size={18} />;
            default:
                return <Clock size={18} />;
        }
    };

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">
                Akun Saya
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                        <div className="p-4 border-b text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                                <User size={40} className="text-gray-500" />
                            </div>
                            <h3 className="font-medium">{userData.name}</h3>
                            <p className="text-sm text-gray-500">
                                {userData.email}
                            </p>
                        </div>

                        <nav className="p-2">
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        className={`w-full flex items-center px-3 py-2 rounded-md ${
                                            activeTab === "profile"
                                                ? "bg-kj-red text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <User size={18} className="mr-3" />
                                        <span>Profil Saya</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center px-3 py-2 rounded-md ${
                                            activeTab === "orders"
                                                ? "bg-kj-red text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("orders")}
                                    >
                                        <Package size={18} className="mr-3" />
                                        <span>Pesanan Saya</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center px-3 py-2 rounded-md ${
                                            activeTab === "wishlist"
                                                ? "bg-kj-red text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("wishlist")}
                                    >
                                        <Heart size={18} className="mr-3" />
                                        <span>Wishlist</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center px-3 py-2 rounded-md ${
                                            activeTab === "address"
                                                ? "bg-kj-red text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("address")}
                                    >
                                        <MapPin size={18} className="mr-3" />
                                        <span>Alamat</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center px-3 py-2 rounded-md ${
                                            activeTab === "settings"
                                                ? "bg-kj-red text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("settings")}
                                    >
                                        <Settings size={18} className="mr-3" />
                                        <span>Pengaturan</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-kj-red"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={18} className="mr-3" />
                                        <span>Keluar</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="font-medium">Profil Saya</h2>
                                <Button
                                    variant={isEditing ? "outline" : "default"}
                                    size="sm"
                                    onClick={(e) => {
                                        if (isEditing) {
                                            handleSaveProfile(e);
                                        } else {
                                            setIsEditing(true);
                                        }
                                    }}
                                >
                                    {isEditing ? "Simpan" : "Edit"}
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="name"
                                                value={userData.name}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p className="text-gray-900">
                                                {userData.name}
                                            </p>
                                        )}
                                        {fieldErrors.name && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {fieldErrors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nomor Telepon
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="phoneNumber"
                                                value={userData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p className="text-gray-900">
                                                {userData.phoneNumber}
                                            </p>
                                        )}
                                        {fieldErrors.phoneNumber && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {fieldErrors.phoneNumber}
                                            </p>
                                        )}
                                        {errorMsg && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errorMsg}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <p className="text-gray-900">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-medium">Pesanan Saya</h2>
                            </div>

                            {mockOrders.length > 0 ? (
                                <div className="divide-y">
                                    {mockOrders.map((order) => (
                                        <div key={order.id} className="p-4">
                                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {"Pesanan"} #{order.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(
                                                            order.date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center mt-2 md:mt-0">
                                                    <div className="flex items-center mr-4">
                                                        {getStatusIcon(
                                                            order.status
                                                        )}
                                                        <span className="ml-1">
                                                            {getStatusLabel(
                                                                order.status
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-kj-red">
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                            {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            }
                                                        ).format(order.total)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-md">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center py-2"
                                                    >
                                                        <div className="w-16 h-16 rounded-md overflow-hidden">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-3 flex-grow">
                                                            <Link
                                                                to={`/products/${item.id}`}
                                                                className="font-medium hover:text-kj-red"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                            <div className="text-sm text-gray-500">
                                                                {"Jumlah"}:{" "}
                                                                {item.quantity}{" "}
                                                                x{" "}
                                                                {new Intl.NumberFormat(
                                                                    "id-ID",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "IDR",
                                                                    }
                                                                ).format(
                                                                    item.price
                                                                )}
                                                            </div>
                                                        </div>

                                                        {order.status ===
                                                            "delivered" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-kj-red border-kj-red hover:bg-kj-red hover:text-white"
                                                            >
                                                                <Star
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                Nilai
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Detail Pesanan
                                                </Button>

                                                {order.status ===
                                                    "processing" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-kj-red border-kj-red"
                                                    >
                                                        Lacak Pesanan
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <ShoppingBag
                                        size={48}
                                        className="mx-auto text-gray-300 mb-4"
                                    />
                                    <h3 className="text-xl font-medium mb-2">
                                        Belum ada pesanan
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Anda belum melakukan pemesanan apa pun.
                                    </p>
                                    <Button asChild>
                                        <Link to="/products">
                                            Mulai Belanja
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === "wishlist" && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-medium">Wishlist Saya</h2>
                            </div>

                            {wishlist.length > 0 ? (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {wishlist.map((item) => {
                                        const product = item.product;
                                        const mainImage = product.images.find(
                                            (img: { isMain: true }) =>
                                                img.isMain
                                        );

                                        return (
                                            <div
                                                key={item.id}
                                                className="border rounded-md p-3 flex"
                                            >
                                                <div className="w-20 h-20 rounded-md overflow-hidden">
                                                    <img
                                                        src={
                                                            mainImage?.imageUrl
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-3 flex-grow">
                                                    <Link
                                                        to={`/products/${product.id}`}
                                                        className="font-medium hover:text-kj-red"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <div className="mt-1 font-medium text-kj-red">
                                                        {product.discountPrice ? (
                                                            <div className="flex flex-col items-start">
                                                                <span className="line-through text-xs text-gray-400 mb-1">
                                                                    {new Intl.NumberFormat(
                                                                        "id-ID",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "IDR",
                                                                        }
                                                                    ).format(
                                                                        product.price
                                                                    )}
                                                                </span>
                                                                <span className="text-base">
                                                                    {new Intl.NumberFormat(
                                                                        "id-ID",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "IDR",
                                                                        }
                                                                    ).format(
                                                                        product.discountPrice
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-base">
                                                                {new Intl.NumberFormat(
                                                                    "id-ID",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "IDR",
                                                                    }
                                                                ).format(
                                                                    product.price
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex space-x-2 mt-2">
                                                        {wishlist.map(
                                                            (item) => (
                                                                <Button
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    size="sm"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleAddToCart(
                                                                            e,
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    Tambah ke
                                                                    Keranjang
                                                                </Button>
                                                            )
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveWishlist(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Heart
                                        size={48}
                                        className="mx-auto text-gray-300 mb-4"
                                    />
                                    <h3 className="text-xl font-medium mb-2">
                                        Wishlist kosong
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Anda belum menambahkan produk apa pun ke
                                        wishlist.
                                    </p>
                                    <Button asChild>
                                        <Link to="/products">
                                            Jelajahi Produk
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Address Tab */}
                    {activeTab === "address" && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="font-medium">Alamat Saya</h2>
                                <Button size="sm">Tambah Alamat Baru</Button>
                            </div>

                            <div className="p-4">
                                <div className="border rounded-md p-4 relative">
                                    <div className="absolute top-4 right-4 bg-kj-red text-white text-xs px-2 py-1 rounded-full">
                                        Utama
                                    </div>
                                    <h3 className="font-medium mb-2">
                                        {user.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {user.address}
                                    </p>
                                    <p className="text-gray-600">
                                        {user.phoneNumber}
                                    </p>

                                    <div className="flex space-x-2 mt-4">
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500"
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-medium">Pengaturan</h2>
                            </div>

                            <div className="p-4">
                                <Tabs defaultValue="account">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="account">
                                            Akun
                                        </TabsTrigger>
                                        <TabsTrigger value="notifications">
                                            Notifikasi
                                        </TabsTrigger>
                                        <TabsTrigger value="security">
                                            Keamanan
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="account">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">
                                                    Bahasa
                                                </h3>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant={"default"}
                                                        className="bg-kj-red"
                                                    >
                                                        Indonesia
                                                    </Button>
                                                    <Button
                                                        variant={"default"}
                                                        className="bg-kj-red"
                                                    >
                                                        English
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium mb-2">
                                                    Hapus Akun
                                                </h3>
                                                <p className="text-gray-600 mb-2">
                                                    Menghapus akun akan
                                                    menghapus semua data dan
                                                    tidak dapat dipulihkan.
                                                </p>
                                                <Button variant="destructive">
                                                    Hapus Akun
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="notifications">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">
                                                        Email tentang Pesanan
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Dapatkan notifikasi
                                                        tentang status pesanan
                                                        Anda
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="toggle toggle-primary"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">
                                                        Promosi & Penawaran
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Dapatkan promosi dan
                                                        penawaran khusus
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="toggle toggle-primary"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">
                                                        Ulasan Produk
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Permintaan untuk
                                                        memberikan ulasan produk
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="toggle toggle-primary"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="security">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">
                                                    Ubah Kata Sandi
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Kata Sandi Saat Ini
                                                        </label>
                                                        <Input type="password" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Kata Sandi Baru
                                                        </label>
                                                        <Input type="password" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Konfirmasi Kata
                                                            Sandi Baru
                                                        </label>
                                                        <Input type="password" />
                                                    </div>

                                                    <Button className="mt-2">
                                                        Ubah Kata Sandi
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium mb-3">
                                                    Verifikasi Dua Faktor
                                                </h3>
                                                <p className="text-gray-600 mb-3">
                                                    Tingkatkan keamanan akun
                                                    Anda dengan verifikasi dua
                                                    faktor.
                                                </p>
                                                <Button variant="outline">
                                                    Aktifkan Verifikasi Dua
                                                    Faktor
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
