import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";

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
    updated_at: string;
    review_image?: ReviewImage[];
    user?: {
        id: string;
        name: string | null;
        email: string;
    };
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

type TopSellingProduct = {
    product: {
        id: string;
        name: string;
    };
    totalQuantity: number;
};

interface OrderItemForTopSelling {
    product_id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
    };
    order: {
        id: string;
        status: string;
    };
}

type ProductStore = {
    categories: Category[];
    products: Product[];
    productDetail: Product | null;
    topSellingProduct: TopSellingProduct | null;
    error: string | null;
    getCategories: () => Promise<void>;
    getAllProducts: () => Promise<void>;
    getProductsByCategory: (categoryId: string) => Promise<void>;
    getProductById: (productId: string) => Promise<void>;
    getHotProducts: () => Promise<void>;
    getLatestProducts: () => Promise<void>;
    getTopSellingProduct: () => Promise<void>;
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    clearError: () => void;
};

export const useProductStore = create<ProductStore>()(
    persist(
        (set, get) => ({
            categories: [],
            products: [],
            productDetail: null,
            topSellingProduct: null,
            error: null,

            clearError: () => set({ error: null }),

            getCategories: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("categories");
                try {
                    set({ error: null });
                    const { data, error } = await supabase
                        .from("category")
                        .select(
                            `
              *,
              product(count)
            `
                        )
                        .order("name", { ascending: true });

                    if (error) throw error;

                    const formatted = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        image_url: item.image_url,
                        productCount: item.product[0]?.count ?? 0,
                    }));

                    set({ categories: formatted });
                } catch (error: any) {
                    console.error("Error fetching categories:", error);
                    set({
                        error: error.message || "Failed to fetch categories",
                    });
                } finally {
                    stopLoading("categories");
                }
            },

            getAllProducts: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("all-products");
                try {
                    set({ error: null });
                    const { data, error } = await supabase
                        .from("product")
                        .select(
                            `
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
            `
                        )
                        .order("name", { ascending: true });

                    if (error) throw error;
                    set({ products: data || [] });
                } catch (error: any) {
                    console.error("Error fetching all products:", error);
                    set({ error: error.message || "Failed to fetch products" });
                } finally {
                    stopLoading("all-products");
                }
            },

            getProductsByCategory: async (categoryId) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("products-by-category");
                try {
                    set({ error: null });
                    const { data, error } = await supabase
                        .from("product")
                        .select(
                            `
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
            `
                        )
                        .eq("category_id", categoryId)
                        .order("name", { ascending: true });

                    if (error) throw error;
                    set({ products: data || [] });
                } catch (error: any) {
                    console.error(
                        "Error fetching products by category:",
                        error
                    );
                    set({ error: error.message || "Failed to fetch products" });
                } finally {
                    stopLoading("products-by-category");
                }
            },

            getProductById: async (productId: string) => {
                set({ error: null });
                useLoadingStore.getState().startLoading("product-detail");

                try {
                    const { data, error } = await supabase
                        .from("product")
                        .select(
                            `
                        *,
                        category(id, name),
                        product_image(id, image_url, is_main, created_at),
                        reviews:review(
                        id,
                        user_id,
                        rating,
                        comment,
                        created_at,
                        updated_at,
                        review_image(id, image_url, created_at),
                        user!review_user_id_fkey(id, name, email)
                        )
                    `
                        )
                        .eq("id", productId)
                        .single();

                    if (error) {
                        if (error.code === "PGRST116") {
                            set({ error: "Produk tidak ditemukan" });
                        } else {
                            set({ error: error.message });
                        }
                        return;
                    }

                    set({ productDetail: data });
                } catch (error: any) {
                    set({
                        error: error.message || "Gagal mengambil detail produk",
                    });
                } finally {
                    useLoadingStore.getState().stopLoading("product-detail");
                }
            },

            getHotProducts: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("hot-products");
                try {
                    set({ error: null });
                    const { data, error } = await supabase
                        .from("product")
                        .select(
                            `
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
            `
                        )
                        .eq("is_hot", true)
                        .order("name", { ascending: true });

                    if (error) throw error;
                    set({ products: data || [] });
                } catch (error: any) {
                    console.error("Error fetching hot products:", error);
                    set({
                        error: error.message || "Failed to fetch hot products",
                    });
                } finally {
                    stopLoading("hot-products");
                }
            },

            getLatestProducts: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("latest-products");
                try {
                    set({ error: null });
                    const { data, error } = await supabase
                        .from("product")
                        .select(
                            `
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
            `
                        )
                        .order("created_at", { ascending: false })
                        .limit(4);

                    if (error) throw error;
                    set({ products: data || [] });
                } catch (error: any) {
                    console.error("Error fetching latest products:", error);
                    set({
                        error:
                            error.message || "Failed to fetch latest products",
                    });
                } finally {
                    stopLoading("latest-products");
                }
            },

            getTopSellingProduct: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("top-selling-product");

                try {
                    set({ error: null });

                    const { data, error } = await supabase
                        .from("order_item")
                        .select(
                            `
                product_id,
                quantity,
                product(id, name),
                order!inner(id, status)
                `
                        )
                        .eq("order.status", "DELIVERED")
                        .returns<OrderItemForTopSelling[]>();

                    if (error) throw error;

                    if (!data || data.length === 0) {
                        set({ topSellingProduct: null });
                        return;
                    }

                    const productSales: { [key: string]: TopSellingProduct } =
                        {};

                    data.forEach((item) => {
                        if (item.product && item.product_id) {
                            if (productSales[item.product_id]) {
                                productSales[item.product_id].totalQuantity +=
                                    item.quantity;
                            } else {
                                productSales[item.product_id] = {
                                    product: {
                                        id: item.product.id,
                                        name: item.product.name,
                                    },
                                    totalQuantity: item.quantity,
                                };
                            }
                        }
                    });

                    const topSelling = Object.values(productSales).reduce(
                        (max, current) =>
                            current.totalQuantity > (max?.totalQuantity || 0)
                                ? current
                                : max,
                        null as TopSellingProduct | null
                    );

                    set({ topSellingProduct: topSelling });
                } catch (error: any) {
                    console.error("Error fetching top selling product:", error);
                    set({
                        error:
                            error.message ||
                            "Failed to fetch top selling product",
                    });
                } finally {
                    stopLoading("top-selling-product");
                }
            },

            fetchProducts: async function () {
                return this.getAllProducts();
            },

            fetchCategories: async function () {
                return this.getCategories();
            },
        }),
        {
            name: "product-store",
            partialize: (state) => ({
                categories: state.categories,
            }),
        }
    )
);
