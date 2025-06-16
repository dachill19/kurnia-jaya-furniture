import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Search,
    Eye,
    Edit,
    Trash,
    TrendingUp,
    AlertTriangle,
} from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useAdminProductStore } from "@/stores/admin/adminProductStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const AdminProductsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const { products, getAllProducts, error: productError } = useProductStore();
    const {
        deleteProduct,
        error: adminError,
        clearError,
    } = useAdminProductStore();
    const { isLoadingKey } = useLoadingStore();
    const { toast } = useToast();

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        if (productError || adminError) {
            toast({
                title: "Error",
                description: productError || adminError,
                variant: "destructive",
            });
            clearError();
        }
    }, [productError, adminError, toast, clearError]);

    // Get unique categories from products
    const categories = Array.from(
        new Set(
            products
                .filter((product) => product.category?.name)
                .map((product) => product.category!.name)
        )
    ).sort();

    const filteredProducts = products.filter((product) => {
        // Category filter
        if (
            categoryFilter !== "ALL" &&
            product.category?.name !== categoryFilter
        ) {
            return false;
        }

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                product.name.toLowerCase().includes(searchLower) ||
                product.id.toLowerCase().includes(searchLower) ||
                product.category?.name.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            await deleteProduct(id);
            toast({
                title: "Success",
                description: `${name} has been deleted.`,
            });
        }
    };

    const getStatusBadge = (stock: number) => {
        return stock <= 10
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700";
    };

    // Stats calculation with type safety
    const stats = {
        totalProducts: products.length,
        lowStock: products.filter((p) => p.stock <= 5).length,
        topSelling:
            products.length > 0
                ? products.reduce((max, p) => {
                      const maxReviews = max?.reviews?.length || 0;
                      const pReviews = p.reviews?.length || 0;
                      return pReviews > maxReviews ? p : max;
                  }, products[0])
                : null,
        totalReviews: products.reduce(
            (sum, p) => sum + (p.reviews?.length || 0),
            0
        ),
    };

    const productStats = [
        {
            title: "Total Produk",
            value: stats.totalProducts,
            icon: Package,
            color: "text-blue-600",
        },
        {
            title: "Stok Rendah",
            value: stats.lowStock,
            icon: AlertTriangle,
            color: "text-red-600",
        },
        {
            title: "Produk Terlaris",
            value: stats.topSelling?.reviews?.length || 0,
            trend: stats.topSelling?.name || "N/A",
            icon: TrendingUp,
            color: "text-green-600",
        },
        {
            title: "Total Reviews",
            value: stats.totalReviews,
            icon: Eye,
            color: "text-purple-600",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                    Produk
                </h2>
                <Button
                    className="bg-kj-red hover:bg-kj-red/90 w-full sm:w-auto px-6"
                    onClick={() => navigate("/admin/products/add")}
                >
                    <Package className="h-4 w-4 mr-2" />
                    Tambah Produk
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {productStats.map((stat, index) => (
                    <Card
                        key={index}
                        className="border-none shadow-sm hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">
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

            {/* Products Grid */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Data Produk ({filteredProducts.length})
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Select
                                value={categoryFilter}
                                onValueChange={(value: string) =>
                                    setCategoryFilter(value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filter Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 border-gray-200 focus:border-kj-red focus:ring-kj-red"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingKey("all-products") ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500">
                                Loading products...
                            </div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {searchTerm || categoryFilter !== "ALL"
                                        ? "Tidak ada produk yang sesuai dengan filter"
                                        : "Belum ada produk"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="border-none shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col"
                                >
                                    <CardContent className="p-4 flex flex-col h-full">
                                        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                src={
                                                    product.product_image?.find(
                                                        (img) => img.is_main
                                                    )?.image_url ||
                                                    "/placeholder.jpg"
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-semibold text-base truncate text-gray-800">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {product.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500">
                                                        Harga:
                                                    </span>
                                                    <p className="font-medium text-kj-red">
                                                        Rp{" "}
                                                        {product.price.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">
                                                        Stok:
                                                    </span>
                                                    <p className="font-medium">
                                                        {product.stock}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-sm">
                                                <span className="text-gray-500">
                                                    Kategori:
                                                </span>
                                                <p className="font-medium truncate">
                                                    {product.category?.name ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    className={getStatusBadge(
                                                        product.stock
                                                    )}
                                                >
                                                    {product.stock <= 10
                                                        ? "Stok Rendah"
                                                        : "Tersedia"}
                                                </Badge>
                                                {product.is_hot && (
                                                    <Badge className="bg-orange-100 text-orange-700">
                                                        Hot
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-auto flex gap-2 pt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/products/${product.id}`
                                                    )
                                                }
                                                className="flex-1"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/products/${product.id}/edit`
                                                    )
                                                }
                                                className="flex-1"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id,
                                                        product.name
                                                    )
                                                }
                                                className="flex-1 bg-kj-red hover:bg-kj-red/90"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProductsPage;
