import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/cloudinary";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_item_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  review_image?: { id: string; image_url: string; created_at: string }[];
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ReviewState {
  error: string | null;
  getReviewByOrderItemId: (orderItemId: string) => Promise<Review | null>;
  createReview: (
    userId: string,
    productId: string,
    orderItemId: string,
    rating: number,
    comment: string,
    images: File[]
  ) => Promise<void>;
  updateReview: (
    reviewId: string,
    rating: number,
    comment: string,
    newImages: File[],
    existingImages: string[]
  ) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  clearError: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  error: null,
  getReviewByOrderItemId: async (orderItemId: string) => {
    try {
      const { data, error } = await supabase
        .from("review")
        .select(`
          *,
          review_image(id, image_url, created_at),
          user!review_user_id_fkey(id, name, email)
        `)
        .eq("order_item_id", orderItemId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }

      return data || null;
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch review" });
      throw error;
    }
  },
  createReview: async (
    userId: string,
    productId: string,
    orderItemId: string,
    rating: number,
    comment: string,
    images: File[]
  ) => {
    try {
      const { data: reviewData, error: reviewError } = await supabase
        .from("review")
        .insert({
          user_id: userId,
          product_id: productId,
          order_item_id: orderItemId,
          rating,
          comment: comment.trim() || null,
        })
        .select()
        .single();

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      if (images.length > 0) {
        const imageUrls = await Promise.all(
          images.map((image) => uploadImage(image, "review"))
        );

        const { error: imageError } = await supabase
          .from("review_image")
          .insert(
            imageUrls.map((image_url) => ({
              review_id: reviewData.id,
              image_url,
            }))
          );

        if (imageError) {
          throw new Error(imageError.message);
        }
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to create review" });
      throw error;
    }
  },
  updateReview: async (
    reviewId: string,
    rating: number,
    comment: string,
    newImages: File[],
    existingImages: string[]
  ) => {
    try {
      const { error: reviewError } = await supabase
        .from("review")
        .update({
          rating,
          comment: comment.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reviewId);

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      const { data: currentImages, error: fetchImageError } = await supabase
        .from("review_image")
        .select("image_url")
        .eq("review_id", reviewId);

      if (fetchImageError) {
        throw new Error(fetchImageError.message);
      }

      const currentImageUrls = currentImages.map((img) => img.image_url);
      const imagesToDelete = currentImageUrls.filter(
        (url) => !existingImages.includes(url)
      );

      if (imagesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("review_image")
          .delete()
          .eq("review_id", reviewId)
          .in("image_url", imagesToDelete);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }

      if (newImages.length > 0) {
        const newImageUrls = await Promise.all(
          newImages.map((image) => uploadImage(image, "review"))
        );

        const { error: imageError } = await supabase
          .from("review_image")
          .insert(
            newImageUrls.map((image_url) => ({
              review_id: reviewId,
              image_url,
            }))
          );

        if (imageError) {
          throw new Error(imageError.message);
        }
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to update review" });
      throw error;
    }
  },
  deleteReview: async (reviewId: string) => {
    try {
      // Delete review images first
      const { error: imageError } = await supabase
        .from("review_image")
        .delete()
        .eq("review_id", reviewId);

      if (imageError) {
        throw new Error(imageError.message);
      }

      // Delete review
      const { error: reviewError } = await supabase
        .from("review")
        .delete()
        .eq("id", reviewId);

      if (reviewError) {
        throw new Error(reviewError.message);
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to delete review" });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
}));