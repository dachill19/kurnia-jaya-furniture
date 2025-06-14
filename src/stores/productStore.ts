import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useLoadingStore } from './loadingStore';
import { uploadImage } from '../lib/cloudinary';

type Category = {
  id: string;
  name: string;
  image_url: string;
  productCount?: number;
};

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

type ProductStore = {
  categories: Category[];
  products: Product[];
  productDetail: Product | null;
  error: string | null;
  getCategories: () => Promise<void>;
  getAllProducts: () => Promise<void>;
  getProductsByCategory: (categoryId: string) => Promise<void>;
  getProductById: (productId: string) => Promise<void>;
  getHotProducts: () => Promise<void>;
  getLatestProducts: () => Promise<void>;
  createProduct: (
    product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'product_image' | 'reviews' | 'category'>,
    images: File[]
  ) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>, images?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      categories: [],
      products: [],
      productDetail: null,
      error: null,

      clearError: () => set({ error: null }),

      getCategories: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('categories');
        try {
          set({ error: null });
          const { data, error } = await supabase
            .from('category')
            .select(`
              *,
              product(count)
            `)
            .order('name', { ascending: true });

          if (error) throw error;

          const formatted = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            image_url: item.image_url,
            productCount: item.product[0]?.count ?? 0,
          }));

          set({ categories: formatted });
        } catch (error: any) {
          console.error('Error fetching categories:', error);
          set({ error: error.message || 'Failed to fetch categories' });
        } finally {
          stopLoading('categories');
        }
      },

      getAllProducts: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('all-products');
        try {
          set({ error: null });
          const { data, error } = await supabase
            .from('product')
            .select(`
              *,
              category(*),
              product_image(*),
              reviews:review(
                id,
                rating,
                comment,
                created_at,
                user_id,
                review_image(*)
              )
            `)
            .order('name', { ascending: true });

          if (error) throw error;
          set({ products: data || [] });
        } catch (error: any) {
          console.error('Error fetching all products:', error);
          set({ error: error.message || 'Failed to fetch products' });
        } finally {
          stopLoading('all-products');
        }
      },

      getProductsByCategory: async (categoryId) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('products-by-category');
        try {
          set({ error: null });
          const { data, error } = await supabase
            .from('product')
            .select(`
              *,
              category(*),
              product_image(*),
              reviews:review(
                id,
                rating,
                comment,
                created_at,
                user_id,
                review_image(*)
              )
            `)
            .eq('category_id', categoryId)
            .order('name', { ascending: true });

          if (error) throw error;
          set({ products: data || [] });
        } catch (error: any) {
          console.error('Error fetching products by category:', error);
          set({ error: error.message || 'Failed to fetch products' });
        } finally {
          stopLoading('products-by-category');
        }
      },

      getProductById: async (productId) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('product-detail');
        try {
          set({ error: null });
          const { data, error } = await supabase
            .from('product')
            .select(`
              *,
              category(*),
              product_image(*),
              reviews:review(
                id,
                rating,
                comment,
                created_at,
                user_id,
                review_image(
                  id,
                  image_url,
                  created_at
                )
              )
            `)
            .eq('id', productId)
            .single();

          if (error) throw error;
          set({ productDetail: data });
        } catch (error: any) {
          console.error('Error fetching product detail:', error);
          set({ error: error.message || 'Failed to fetch product details' });
        } finally {
          stopLoading('product-detail');
        }
      },

      getHotProducts: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('hot-products');
        try {
          set({ error: null });
          const { data, error } = await supabase
            .from('product')
            .select(`
              *,
              category(*),
              product_image(*),
              reviews:review(
                id,
                rating,
                comment,
                created_at,
                user_id,
                review_image(*)
              )
            `)
            .eq('is_hot', true)
            .order('name', { ascending: true });

          if (error) throw error;
          set({ products: data || [] });
        } catch (error: any) {
          console.error('Error fetching hot products:', error);
          set({ error: error.message || 'Failed to fetch hot products' });
        } finally {
          stopLoading('hot-products');
        }
      },

      getLatestProducts: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('latest-products');
        try {
          set({ error: null });
          const { data, error } = await supabase
            .from('product')
            .select(`
              *,
              category(*),
              product_image(*),
              reviews:review(
                id,
                rating,
                comment,
                created_at,
                user_id,
                review_image(*)
              )
            `)
            .order('created_at', { ascending: false })
            .limit(4);

          if (error) throw error;
          set({ products: data || [] });
        } catch (error: any) {
          console.error('Error fetching latest products:', error);
          set({ error: error.message || 'Failed to fetch latest products' });
        } finally {
          stopLoading('latest-products');
        }
      },

      createProduct: async (product, images) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading('create-product');
        try {
          set({ error: null });
          // Insert product to Supabase
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

          // Upload images to Cloudinary and insert to product_image
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

          // Update store
          const newProduct = {
            ...productData,
            product_image: imageData,
            category: get().categories.find((c) => c.id === product.category_id),
            reviews: [],
          };
          set((state) => ({
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
          // Update product in Supabase
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

          // Handle images if provided
          let imageData = productData.product_image || [];
          if (images && images.length > 0) {
            // Delete existing images
            const { error: deleteImageError } = await supabase
              .from('product_image')
              .delete()
              .eq('product_id', id);
            if (deleteImageError) throw deleteImageError;

            // Upload new images
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

          // Update store
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id
                ? {
                    ...productData,
                    category: get().categories.find((c) => c.id === product.category_id),
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
          // Delete product images first
          const { error: imageError } = await supabase
            .from('product_image')
            .delete()
            .eq('product_id', id);
          if (imageError) throw imageError;

          // Delete product
          const { error: productError } = await supabase
            .from('product')
            .delete()
            .eq('id', id);
          if (productError) throw productError;

          // Update store
          set((state) => ({
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
      name: 'product-store',
      partialize: (state) => ({
        categories: state.categories,
      }),
    }
  )
);
