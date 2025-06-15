import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories, getCategories } = useProductStore();
  const { updateCategory, error: categoryError, clearError } = useAdminCategoryStore();
  const { isLoadingKey, startLoading, stopLoading } = useLoadingStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setFormData({ name: category.name });
        setExistingImage(category.image_url || null);
      }
    }
  }, [categories, categoryId]);

  useEffect(() => {
    if (categoryError) {
      toast({
        title: "Error",
        description: categoryError,
        variant: "destructive",
      });
      clearError();
    }
  }, [categoryError, toast, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (image && previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setImage(null);
    setPreviewImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori harus diisi.",
        variant: "destructive",
      });
      return;
    }

    startLoading("update-category");
    try {
      await updateCategory(categoryId, { name: formData.name.trim() }, image);
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      toast({
        title: "Success",
        description: "Kategori berhasil diperbarui.",
      });
      navigate("/admin/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui kategori.",
        variant: "destructive",
      });
    } finally {
      stopLoading("update-category");
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  if (!categoryId || !categories.find((c) => c.id === categoryId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Kategori tidak ditemukan.</p>
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
          Edit Kategori
        </h2>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Formulir Edit Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Kategori *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gambar Kategori
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-kj-red hover:text-kj-red/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-kj-red"
                    >
                      <span>Upload gambar</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hingga 10MB
                  </p>
                </div>
              </div>
              {(image || existingImage) && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Gambar Kategori
                  </h4>
                  <div className="relative group w-fit">
                    <img
                      src={previewImage || existingImage || "/placeholder.jpg"}
                      alt="Category image"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/products")}
                disabled={isLoadingKey("update-category")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-kj-red hover:bg-kj-red/90"
                disabled={isLoadingKey("update-category")}
              >
                {isLoadingKey("update-category") ? (
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

export default EditCategoryPage;