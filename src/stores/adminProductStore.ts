import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useLoadingStore } from './loadingStore';
import { uploadImage } from '../lib/cloudinary';
import { useProductStore } from './productStore';

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
};

type ReviewImage = {
  id: string;
  review_id: string;
  image_url: string;
  created_at: string;
};

type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  review_image?: ReviewImage[];
};

type Category = {
  id: string;
  name: string;
  image_url: string;
  productCount?: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  category_id: string;
  is_hot: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  product_image?: ProductImage[];
  reviews?: Review[];
};

type AdminProductStore = {
  error: string | null;
  createProduct: (
    product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'product_image' | 'reviews' | 'category'>,
    images: File[]
  ) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>, images?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useAdminProductStore = create<AdminProductStore>()(
  persist(
    (set) => ({
      error: null,

      clearError: () => set({ error: null }),

      createProduct: async (product, images) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('create-product');
        try {
          set({ error: null });
          const { data: productData, error: productError } = await supabase
            .from('product')
            .insert({
              id: crypto.randomUUID(),
              name: product.name,
              description: product.description,
              price: product.price,
              discount_price: product.discount_price,
              stock: product.stock,
              category_id: product.category_id,
              is_hot: product.is_hot,
            })
            .select()
            .single();

          if (productError) throw productError;

          const imagePromises = images.map(async (file: File, index: number) => {
            const imageUrl = await uploadImage(file);
            return {
              product_id: productData.id,
              image_url: imageUrl,
              is_main: index === 0,
            };
          });
          const imageData = await Promise.all(imagePromises);
          const { error: imageError } = await supabase
            .from('product_image')
            .insert(imageData);

          if (imageError) throw imageError;

          const newProduct = {
            ...productData,
            product_image: imageData,
            category: useProductStore.getState().categories.find((c) => c.id === product.category_id),
            reviews: [],
          };
          useProductStore.setState((state) => ({
            products: [...state.products, newProduct],
          }));
        } catch (error: any) {
          console.error('Error creating product:', error);
          set({ error: error.message || 'Failed to create product' });
        } finally {
          stopLoading('create-product');
        }
      },

      updateProduct: async (id, product, images) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('update-product');
        try {
          set({ error: null });
          const { data: productData, error: productError } = await supabase
            .from('product')
            .update({
              name: product.name,
              description: product.description,
              price: product.price,
              discount_price: product.discount_price,
              stock: product.stock,
              category_id: product.category_id,
              is_hot: product.is_hot,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

          if (productError) throw productError;

          let imageData = productData.product_image || [];
          if (images && images.length > 0) {
            const { error: deleteImageError } = await supabase
              .from('product_image')
              .delete()
              .eq('product_id', id);
            if (deleteImageError) throw deleteImageError;

            const imagePromises = images.map(async (file: File, index: number) => {
              const imageUrl = await uploadImage(file);
              return {
                product_id: id,
                image_url: imageUrl,
                is_main: index === 0,
              };
            });
            imageData = await Promise.all(imagePromises);
            const { error: imageError } = await supabase
              .from('product_image')
              .insert(imageData);
            if (imageError) throw imageError;
          }

          useProductStore.setState((state) => ({
            products: state.products.map((p) =>
              p.id === id
                ? {
                    ...productData,
                    category: useProductStore.getState().categories.find((c) => c.id === product.category_id),
                    product_image: imageData.length > 0 ? imageData : p.product_image,
                    reviews: p.reviews,
                  }
                : p
            ),
            productDetail: state.productDetail?.id === id ? { ...productData, product_image: imageData } : state.productDetail,
          }));
        } catch (error: any) {
          console.error('Error updating product:', error);
          set({ error: error.message || 'Failed to update product' });
        } finally {
          stopLoading('update-product');
        }
      },

      deleteProduct: async (id) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('delete-product');
        try {
          set({ error: null });
          const { error: imageError } = await supabase
            .from('product_image')
            .delete()
            .eq('product_id', id);
          if (imageError) throw imageError;

          const { error: productError } = await supabase
            .from('product')
            .delete()
            .eq('id', id);
          if (productError) throw productError;

          useProductStore.setState((state) => ({
            products: state.products.filter((p) => p.id !== id),
            productDetail: state.productDetail?.id === id ? null : state.productDetail,
          }));
        } catch (error: any) {
          console.error('Error deleting product:', error);
          set({ error: error.message || 'Failed to delete product' });
        } finally {
          stopLoading('delete-product');
        }
      },
    }),
    {
      name: 'admin-product-store',
      partialize: (state) => ({}),
    }
  )
);
