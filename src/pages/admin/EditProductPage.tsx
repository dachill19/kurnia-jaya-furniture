import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, X, Upload, Edit, Trash } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useAdminProductStore } from "@/stores/admin/adminProductStore";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const EditProductPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const {
        categories,
        productDetail,
        getCategories,
        getProductById,
        error: productError,
    } = useProductStore();
    const {
        updateProduct,
        error: adminError,
        clearError: clearProductError,
    } = useAdminProductStore();
    const { error: categoryError, clearError: clearCategoryError } =
        useAdminCategoryStore();
    const { isLoadingKey, startLoading, stopLoading } = useLoadingStore();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        stock: "",
        category_id: "",
        is_hot: false,
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<
        { id: string; image_url: string; is_main: boolean }[]
    >([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        getCategories();
        if (productId) {
            getProductById(productId);
        }
    }, [getCategories, getProductById, productId]);

    useEffect(() => {
        if (productDetail && productDetail.id === productId) {
            setFormData({
                name: productDetail.name,
                description: productDetail.description,
                price: productDetail.price.toString(),
                discount_price: productDetail.discount_price?.toString() || "",
                stock: productDetail.stock.toString(),
                category_id: productDetail.category_id,
                is_hot: productDetail.is_hot,
            });
            setExistingImages(productDetail.product_image || []);
        }
    }, [productDetail, productId]);

    useEffect(() => {
        if (productError || adminError || categoryError) {
            toast({
                title: "Error",
                description: productError || adminError || categoryError,
                variant: "destructive",
            });
            clearProductError();
            clearCategoryError();
        }
    }, [
        productError,
        adminError,
        categoryError,
        toast,
        clearProductError,
        clearCategoryError,
    ]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        if (value === "add_category") {
            navigate("/admin/categories/add");
        } else {
            setFormData((prev) => ({ ...prev, category_id: value }));
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, is_hot: checked }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);

            const newPreviews = newFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewImages((prev) => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveNewImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previewImages.filter((_, i) => i !== index);

        URL.revokeObjectURL(previewImages[index]);

        setImages(newImages);
        setPreviewImages(newPreviews);
    };

    const handleRemoveExistingImage = (imageId: string) => {
        setExistingImages(existingImages.filter((img) => img.id !== imageId));
    };

    const handleEditCategory = (categoryId: string) => {
        navigate(`/admin/categories/${categoryId}/edit`);
    };

    const handleDeleteCategory = async (
        categoryId: string,
        categoryName: string
    ) => {
        if (
            window.confirm(`Apakah Anda yakin ingin menghapus ${categoryName}?`)
        ) {
            const { deleteCategory } = useAdminCategoryStore.getState();
            startLoading("delete-category");
            try {
                await deleteCategory(categoryId);
                toast({
                    title: "Success",
                    description: `${categoryName} telah dihapus.`,
                });
                getCategories();
                if (formData.category_id === categoryId) {
                    setFormData((prev) => ({ ...prev, category_id: "" }));
                }
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Gagal menghapus kategori.",
                    variant: "destructive",
                });
            } finally {
                stopLoading("delete-category");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;

        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Nama produk harus diisi.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.description.trim()) {
            toast({
                title: "Error",
                description: "Deskripsi produk harus diisi.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.category_id) {
            toast({
                title: "Error",
                description: "Kategori harus dipilih.",
                variant: "destructive",
            });
            return;
        }

        const price = parseFloat(formData.price);
        const stock = parseInt(formData.stock);

        if (isNaN(price) || price <= 0) {
            toast({
                title: "Error",
                description: "Harga harus valid dan lebih dari 0.",
                variant: "destructive",
            });
            return;
        }

        if (isNaN(stock) || stock < 0) {
            toast({
                title: "Error",
                description: "Stok harus valid dan tidak boleh negatif.",
                variant: "destructive",
            });
            return;
        }

        startLoading("update-product");
        try {
            const product = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: price,
                discount_price: formData.discount_price
                    ? parseFloat(formData.discount_price)
                    : null,
                stock: stock,
                category_id: formData.category_id,
                is_hot: formData.is_hot,
            };

            await updateProduct(
                productId,
                product,
                images.length > 0 ? images : undefined
            );

            previewImages.forEach((url) => URL.revokeObjectURL(url));

            toast({
                title: "Success",
                description: "Produk berhasil diperbarui.",
            });
            navigate("/admin/products");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Gagal memperbarui produk.",
                variant: "destructive",
            });
        } finally {
            stopLoading("update-product");
        }
    };

    useEffect(() => {
        return () => {
            previewImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    if (isLoadingKey("product-detail")) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kj-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat detail produk...</p>
                </div>
            </div>
        );
    }

    if (!productDetail || productDetail.id !== productId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Produk tidak ditemukan.
                    </p>
                    <Button onClick={() => navigate("/admin/products")}>
                        Kembali ke Produk
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/products")}
                    className="p-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
                    Edit Produk
                </h2>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Formulir Edit Produk</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nama Produk *
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Masukkan nama produk"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="category_id"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Kategori *
                                </label>
                                <Select
                                    value={formData.category_id}
                                    onValueChange={handleSelectChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between px-2 py-1 hover:bg-gray-100"
                                            >
                                                <SelectItem
                                                    value={category.id}
                                                    className="flex-1 cursor-pointer"
                                                >
                                                    {category.name}
                                                </SelectItem>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditCategory(
                                                                category.id
                                                            )
                                                        }
                                                        disabled={isLoadingKey(
                                                            "delete-category"
                                                        )}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                category.id,
                                                                category.name
                                                            )
                                                        }
                                                        disabled={isLoadingKey(
                                                            "delete-category"
                                                        )}
                                                    >
                                                        <Trash className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-200 mt-2">
                                            <SelectItem
                                                value="add_category"
                                                className="flex items-center px-2 py-2 cursor-pointer text-kj-red hover:bg-gray-100"
                                            >
                                                + Tambah Kategori
                                            </SelectItem>
                                        </div>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Deskripsi *
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                placeholder="Masukkan deskripsi produk"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Harga (Rp) *
                                </label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="discount_price"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Harga Diskon (Rp)
                                </label>
                                <Input
                                    id="discount_price"
                                    name="discount_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.discount_price}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="stock"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Stok *
                                </label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="images"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Gambar Produk Baru
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="images"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-kj-red hover:text-kj-red/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-kj-red"
                                        >
                                            <span>Upload gambar</span>
                                            <input
                                                id="images"
                                                name="images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">
                                            atau drag and drop
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF hingga 10MB
                                    </p>
                                </div>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Gambar Baru
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {images.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={previewImages[index]}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveNewImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    {file.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {existingImages.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Gambar Saat Ini
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {existingImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="relative group"
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt="Existing product"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveExistingImage(
                                                            image.id
                                                        )
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                {image.is_main && (
                                                    <div className="absolute bottom-1 left-1 bg-kj-red text-white text-xs px-2 py-1 rounded">
                                                        Utama
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_hot"
                                checked={formData.is_hot}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <label
                                htmlFor="is_hot"
                                className="text-sm font-medium text-gray-700"
                            >
                                Produk Hot (Produk Unggulan)
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/products")}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-kj-red hover:bg-kj-red/90 w-full sm:w-auto"
                                disabled={isLoadingKey("update-product")}
                            >
                                {isLoadingKey("update-product") ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProductPage;
