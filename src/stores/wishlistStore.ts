import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./authStore";

// Separated Types - Single Object Version
type WishlistCategory = {
    id: string;
    name: string;
};

type WishlistProductImage = {
    id: string;
    product_id: string;
    image_url: string;
    is_main: boolean;
    created_at: string;
};

type WishlistProduct = {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    category?: WishlistCategory;
    product_image?: WishlistProductImage[];
};

type WishlistItem = {
    id: string;
    product_id: string;
    user_id: string;
    created_at: string;
    product?: WishlistProduct | null;
};

// Store Interface
interface WishlistState {
    wishlist: WishlistItem[];
    error: string | null;

    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => Promise<void>;
    clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],
            error: null,

            clearError: () => set({ error: null }),

            fetchWishlist: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("wishlist-fetch");

                try {
                    set({ error: null });
                    const { user } = useAuthStore.getState();

                    if (!user) {
                        set({ wishlist: [] });
                        return;
                    }

                    const { data, error } = await supabase
                        .from("wishlist")
                        .select(
                            `
                            id,
                            product_id,
                            user_id,
                            created_at,
                            product:product_id (
                                id,
                                name,
                                price,
                                discount_price,
                                product_image (
                                    id,
                                    product_id,
                                    image_url,
                                    is_main,
                                    created_at
                                ),
                                category:category_id (
                                    id,
                                    name
                                )
                            )
                        `
                        )
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });

                    if (error) throw error;

                    // Transform data if needed
                    const transformedData = (data || []).map((item: any) => {
                        // Handle if product is array, take first item
                        let product = null;
                        if (item.product) {
                            if (
                                Array.isArray(item.product) &&
                                item.product.length > 0
                            ) {
                                product = {
                                    ...item.product[0],
                                    category: Array.isArray(
                                        item.product[0].category
                                    )
                                        ? item.product[0].category[0]
                                        : item.product[0].category,
                                };
                            } else if (!Array.isArray(item.product)) {
                                product = {
                                    ...item.product,
                                    category: Array.isArray(
                                        item.product.category
                                    )
                                        ? item.product.category[0]
                                        : item.product.category,
                                };
                            }
                        }

                        return {
                            ...item,
                            product,
                        };
                    });

                    set({ wishlist: transformedData });
                } catch (error: any) {
                    console.error("Error fetching wishlist:", error);
                    set({
                        error: error.message || "Failed to fetch wishlist",
                        wishlist: [],
                    });
                } finally {
                    stopLoading("wishlist-fetch");
                }
            },

            addToWishlist: async (productId: string) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading(`wishlist-add-${productId}`);

                try {
                    set({ error: null });
                    const { user } = useAuthStore.getState();

                    if (!user) {
                        throw new Error("User not authenticated");
                    }

                    // Check if already in wishlist
                    const { data: existing } = await supabase
                        .from("wishlist")
                        .select("id")
                        .eq("user_id", user.id)
                        .eq("product_id", productId)
                        .single();

                    if (existing) {
                        throw new Error("Product already in wishlist");
                    }

                    const { error } = await supabase.from("wishlist").insert({
                        user_id: user.id,
                        product_id: productId,
                    });

                    if (error) throw error;

                    // Refresh wishlist to get the complete data with relations
                    await get().fetchWishlist();
                } catch (error: any) {
                    console.error("Error adding to wishlist:", error);
                    set({
                        error: error.message || "Failed to add to wishlist",
                    });
                    throw error;
                } finally {
                    stopLoading(`wishlist-add-${productId}`);
                }
            },

            removeFromWishlist: async (productId: string) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading(`wishlist-remove-${productId}`);

                try {
                    set({ error: null });
                    const { user } = useAuthStore.getState();

                    if (!user) {
                        throw new Error("User not authenticated");
                    }

                    const { error } = await supabase
                        .from("wishlist")
                        .delete()
                        .eq("user_id", user.id)
                        .eq("product_id", productId);

                    if (error) throw error;

                    // Update local state immediately
                    const currentWishlist = get().wishlist;
                    const updatedWishlist = currentWishlist.filter(
                        (item) => item.product_id !== productId
                    );
                    set({ wishlist: updatedWishlist });
                } catch (error: any) {
                    console.error("Error removing from wishlist:", error);
                    set({
                        error:
                            error.message || "Failed to remove from wishlist",
                    });
                    throw error;
                } finally {
                    stopLoading(`wishlist-remove-${productId}`);
                }
            },

            isInWishlist: (productId: string) => {
                const wishlist = get().wishlist;
                return wishlist.some((item) => item.product_id === productId);
            },

            clearWishlist: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("wishlist-clear");

                try {
                    set({ error: null });
                    const { user } = useAuthStore.getState();

                    if (!user) return;

                    const { error } = await supabase
                        .from("wishlist")
                        .delete()
                        .eq("user_id", user.id);

                    if (error) throw error;

                    set({ wishlist: [] });
                } catch (error: any) {
                    console.error("Error clearing wishlist:", error);
                    set({ error: error.message || "Failed to clear wishlist" });
                } finally {
                    stopLoading("wishlist-clear");
                }
            },
        }),
        {
            name: "wishlist-store",
            partialize: (state) => ({
                wishlist: state.wishlist,
                // Don't persist error as it should reset on page load
            }),
        }
    )
);
