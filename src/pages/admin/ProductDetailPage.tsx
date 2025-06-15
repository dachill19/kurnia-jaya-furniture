import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Edit,
    Eye,
    TrendingUp,
    Package,
    Calendar,
    Trash,
} from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useAdminProductStore } from "@/stores/admin/adminProductStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const AdminProductDetailPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const { productDetail, getProductById, error } = useProductStore();
    const {
        deleteProduct,
        error: adminError,
        clearError,
    } = useAdminProductStore();
    const { isLoadingKey } = useLoadingStore();
    const { toast } = useToast();

    useEffect(() => {
        if (productId) {
            getProductById(productId);
        }
    }, [productId, getProductById]);

    useEffect(() => {
        if (error || adminError) {
            toast({
                title: "Error",
                description: error || adminError,
                variant: "destructive",
            });
            clearError();
        }
    }, [error, adminError, toast, clearError]);

    const handleDelete = async () => {
        if (!productDetail || !productId) return;

        if (
            window.confirm(
                `Are you sure you want to delete ${productDetail.name}?`
            )
        ) {
            await deleteProduct(productId);
            toast({
                title: "Success",
                description: `${productDetail.name} has been deleted.`,
            });
            navigate("/admin/products");
        }
    };

    const getStatusBadge = (stock: number) => {
        return stock <= 10
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700";
    };

    if (isLoadingKey("product-detail")) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kj-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!productDetail || productDetail.id !== productId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Product not found.</p>
                    <Button onClick={() => navigate("/admin/products")}>
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 container-custom py-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/admin/products")}
                        className="p-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                        Detail Produk - {productDetail.name}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() =>
                            navigate(`/admin/products/${productDetail.id}/edit`)
                        }
                        className="bg-kj-red hover:bg-kj-red/90"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Produk
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoadingKey("delete-product")}
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        {isLoadingKey("delete-product")
                            ? "Deleting..."
                            : "Delete"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Images & Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Galeri Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {productDetail.product_image &&
                                productDetail.product_image.length > 0 ? (
                                    productDetail.product_image.map(
                                        (image, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={`Product image ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                {image.is_main && (
                                                    <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-700">
                                                        Main
                                                    </Badge>
                                                )}
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">
                                            No images
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Informasi Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Nama
                                    </p>
                                    <p className="text-lg font-medium">
                                        {productDetail.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Deskripsi
                                    </p>
                                    <p className="text-gray-700">
                                        {productDetail.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Harga
                                        </p>
                                        <p className="text-lg font-medium">
                                            Rp{" "}
                                            {productDetail.price.toLocaleString(
                                                "id-ID"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Harga Diskon
                                        </p>
                                        <p className="text-lg font-medium">
                                            {productDetail.discount_price
                                                ? `Rp ${productDetail.discount_price.toLocaleString(
                                                      "id-ID"
                                                  )}`
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Stok
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-lg font-medium">
                                                {productDetail.stock}
                                            </p>
                                            <Badge
                                                className={getStatusBadge(
                                                    productDetail.stock
                                                )}
                                            >
                                                {productDetail.stock <= 10
                                                    ? "Low Stock"
                                                    : "In Stock"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Kategori
                                        </p>
                                        <p className="text-lg font-medium">
                                            {productDetail.category?.name ||
                                                "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Produk Hot
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-lg font-medium">
                                            {productDetail.is_hot
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                        {productDetail.is_hot && (
                                            <Badge className="bg-orange-100 text-orange-700">
                                                Hot
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews Section */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>
                                Reviews ({productDetail.reviews?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {productDetail.reviews &&
                            productDetail.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {productDetail.reviews
                                        .slice(0, 5)
                                        .map((review) => (
                                            <div
                                                key={review.id}
                                                className="border-b pb-4 last:border-b-0"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`text-sm ${
                                                                        i <
                                                                        review.rating
                                                                            ? "text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                >
                                                                    ★
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            review.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">
                                                    {review.comment}
                                                </p>
                                                {review.review_image &&
                                                    review.review_image.length >
                                                        0 && (
                                                        <div className="flex gap-2 mt-2">
                                                            {review.review_image.map(
                                                                (
                                                                    img,
                                                                    index
                                                                ) => (
                                                                    <img
                                                                        key={
                                                                            index
                                                                        }
                                                                        src={
                                                                            img.image_url
                                                                        }
                                                                        alt={`Review image ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                    {productDetail.reviews.length > 5 && (
                                        <p className="text-sm text-gray-500 text-center">
                                            And{" "}
                                            {productDetail.reviews.length - 5}{" "}
                                            more reviews...
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No reviews yet
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Statistik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm font-medium text-gray-500">
                                            Reviews
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium">
                                        {productDetail.reviews?.length || 0}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-medium text-gray-500">
                                            Avg Rating
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium">
                                        {productDetail.reviews &&
                                        productDetail.reviews.length > 0
                                            ? (
                                                  productDetail.reviews.reduce(
                                                      (sum, review) =>
                                                          sum + review.rating,
                                                      0
                                                  ) /
                                                  productDetail.reviews.length
                                              ).toFixed(1)
                                            : "0.0"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-purple-600" />
                                        <p className="text-sm font-medium text-gray-500">
                                            Stok Tersisa
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium">
                                        {productDetail.stock}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-600" />
                                        <p className="text-sm font-medium text-gray-500">
                                            Terakhir Diperbarui
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {new Date(
                                            productDetail.updated_at
                                        ).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product ID Card */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Detail Teknis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Product ID
                                    </p>
                                    <p className="text-sm font-mono text-gray-700 break-all">
                                        {productDetail.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Category ID
                                    </p>
                                    <p className="text-sm font-mono text-gray-700 break-all">
                                        {productDetail.category_id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Created At
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {new Date(
                                            productDetail.created_at
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Images Count
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {productDetail.product_image?.length ||
                                            0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                        window.open(
                                            `/products/${productDetail.id}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View as Customer
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                        navigate(
                                            `/admin/products/${productDetail.id}/edit`
                                        )
                                    }
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Product
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetailPage;
