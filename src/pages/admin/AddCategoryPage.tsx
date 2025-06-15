import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload } from "lucide-react";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const { createCategory, error: categoryError, clearError } = useAdminCategoryStore();
  const { isLoadingKey, startLoading, stopLoading } = useLoadingStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
  });
  const [image, setImage] = useState<File | null>(null);

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
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori harus diisi.",
        variant: "destructive",
      });
      return;
    }

    startLoading("create-category");
    try {
      await createCategory({ name: formData.name.trim(), image_url: null }, image);
      toast({
        title: "Success",
        description: "Kategori berhasil ditambahkan.",
      });
      navigate("/admin/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan kategori.",
        variant: "destructive",
      });
    } finally {
      stopLoading("create-category");
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
          Tambah Kategori
        </h2>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Formulir Kategori Baru</CardTitle>
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
              {image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">File yang dipilih:</p>
                  <div className="bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2 w-fit">
                    <span className="text-sm text-gray-700">{image.name}</span>
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ×
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
                disabled={isLoadingKey("create-category")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-kj-red hover:bg-kj-red/90"
                disabled={isLoadingKey("create-category")}
              >
                {isLoadingKey("create-category") ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategoryPage;