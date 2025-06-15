import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../../lib/supabase";
import { useLoadingStore } from "../loadingStore";
import { uploadImage } from "../../lib/cloudinary";
import { useProductStore } from "../productStore";

type Category = {
  id: string;
  name: string;
  image_url: string | null;
  productCount?: number;
};

type AdminCategoryStore = {
  error: string | null;
  createCategory: (category: Omit<Category, "id" | "productCount">, image?: File | null) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>, image?: File | null) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useAdminCategoryStore = create<AdminCategoryStore>()(
  persist(
    (set) => ({
      error: null,

      clearError: () => set({ error: null }),

      createCategory: async (category, image) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading("create-category");
        try {
          set({ error: null });
          let imageUrl = null;
          if (image) {
            imageUrl = await uploadImage(image, "admin_category_upload");
          }

          const { data: categoryData, error: categoryError } = await supabase
            .from("category")
            .insert({
              id: crypto.randomUUID(),
              name: category.name,
              image_url: imageUrl,
            })
            .select()
            .single();

          if (categoryError) throw categoryError;

          useProductStore.setState((state) => ({
            categories: [...state.categories, categoryData],
          }));
        } catch (error: any) {
          console.error("Error creating category:", error);
          set({ error: error.message || "Failed to create category" });
        } finally {
          stopLoading("create-category");
        }
      },

      updateCategory: async (id, category, image) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading("update-category");
        try {
          set({ error: null });
          let imageUrl = category.image_url;
          if (image) {
            imageUrl = await uploadImage(image, "admin_category_upload");
          }

          const { data: categoryData, error: categoryError } = await supabase
            .from("category")
            .update({
              name: category.name,
              image_url: imageUrl,
            })
            .eq("id", id)
            .select()
            .single();

          if (categoryError) throw categoryError;

          useProductStore.setState((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? categoryData : c
            ),
          }));
        } catch (error: any) {
          console.error("Error updating category:", error);
          set({ error: error.message || "Failed to update category" });
        } finally {
          stopLoading("update-category");
        }
      },

      deleteCategory: async (id) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading("delete-category");
        try {
          set({ error: null });
          const { error: categoryError } = await supabase
            .from("category")
            .delete()
            .eq("id", id);

          if (categoryError) throw categoryError;

          useProductStore.setState((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
          }));
        } catch (error: any) {
          console.error("Error deleting category:", error);
          set({ error: error.message || "Failed to delete category" });
        } finally {
          stopLoading("delete-category");
        }
      },
    }),
    {
      name: "admin-category-store",
      partialize: (state) => ({}),
    }
  )
);
