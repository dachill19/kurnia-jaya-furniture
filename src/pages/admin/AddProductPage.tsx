import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useAdminProductStore } from "@/stores/admin/adminProductStore";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const AddProductPage = () => {
    const navigate = useNavigate();
    const {
        categories,
        getCategories,
        error: productError,
    } = useProductStore();
    const {
        createProduct,
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

    useEffect(() => {
        getCategories();
    }, [getCategories]);

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
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
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

        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Nama produk harus diisi.",
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

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast({
                title: "Error",
                description: "Harga harus diisi dan lebih dari 0.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.stock || parseInt(formData.stock) < 0) {
            toast({
                title: "Error",
                description: "Stok harus diisi dan tidak boleh negatif.",
                variant: "destructive",
            });
            return;
        }

        startLoading("create-product");
        try {
            const product = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                discount_price: formData.discount_price
                    ? parseFloat(formData.discount_price)
                    : null,
                stock: parseInt(formData.stock),
                category_id: formData.category_id,
                is_hot: formData.is_hot,
            };

            await createProduct(product, images);

            toast({
                title: "Success",
                description: "Produk berhasil ditambahkan.",
            });

            navigate("/admin/products");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Gagal menambahkan produk.",
                variant: "destructive",
            });
        } finally {
            stopLoading("create-product");
        }
    };

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
                    Tambah Produk
                </h2>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Formulir Produk Baru</CardTitle>
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
                                rows={4}
                                placeholder="Masukkan deskripsi produk"
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
                                    min="0"
                                    step="0.01"
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
                                    min="0"
                                    step="0.01"
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
                                Gambar Produk
                            </label>
                            <Input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {images.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <p className="text-sm text-gray-600">
                                        File yang dipilih:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((file, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2"
                                            >
                                                <span className="text-sm text-gray-700">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    ×
                                                </button>
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
                                Produk Hot (Featured)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/products")}
                                disabled={isLoadingKey("create-product")}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-kj-red hover:bg-kj-red/90"
                                disabled={isLoadingKey("create-product")}
                            >
                                {isLoadingKey("create-product")
                                    ? "Menyimpan..."
                                    : "Simpan Produk"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddProductPage;
