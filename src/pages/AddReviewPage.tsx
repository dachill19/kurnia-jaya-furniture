import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import { useReviewStore } from "@/stores/reviewStore";
import { useAuthStore } from "@/stores/authStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";

const AddReviewPage = () => {
  const navigate = useNavigate();
  const { orderItemId, productId } = useParams<{ orderItemId: string; productId: string }>();
  const { user } = useAuthStore();
  const { createReview, error: reviewError, clearError } = useReviewStore();
  const { isLoadingKey, startLoading, stopLoading } = useLoadingStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (reviewError) {
      toast({
        title: "Error",
        description: reviewError,
        variant: "destructive",
      });
      clearError();
    }
  }, [reviewError, toast, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      setPreviewImages((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !orderItemId || !productId) {
      toast({
        title: "Error",
        description: "User atau data pesanan tidak ditemukan",
        variant: "destructive",
      });
      return;
    }

    if (formData.rating === 0) {
      toast({
        title: "Error",
        description: "Harap berikan rating.",
        variant: "destructive",
      });
      return;
    }

    startLoading("submit-review");
    try {
      await createReview(
        user.id,
        productId,
        orderItemId,
        formData.rating,
        formData.comment,
        images
      );
      toast({
        title: "Success",
        description: "Ulasan berhasil ditambahkan.",
      });
      navigate("/account");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan ulasan.",
        variant: "destructive",
      });
    } finally {
      stopLoading("submit-review");
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  if (!orderItemId || !productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Data ulasan tidak ditemukan.</p>
          <Button onClick={() => navigate("/account")}>
            Kembali ke Akun
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container-custom py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/account")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
          Tambah Ulasan
        </h2>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Formulari Ulasan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={48}
                      className={
                        star <= formData.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Komentar
              </label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Masukkan komentar Anda"
                rows={4}
              />
            </div>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gambar Ulasan
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex items-center text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-kj-red hover:text-kj-red/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-kj-red"
                    >
                      <span>Upload gambar</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                </div>
              </div>
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Gambar yang Dipilih
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative group w-20 h-20">
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/account")}
                disabled={isLoadingKey("submit-review")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-kj-red hover:bg-kj-red/90"
                disabled={isLoadingKey("submit-review")}
              >
                {isLoadingKey("submit-review") ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Kirim Ulasan"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddReviewPage;
