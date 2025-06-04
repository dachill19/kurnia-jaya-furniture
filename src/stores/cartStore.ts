import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./authStore";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    totalItems: number;
    totalPrice: number;

    fetchCart: () => Promise<void>;
    addToCart: (
        item: Omit<CartItem, "quantity">,
        quantity?: number
    ) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            totalItems: 0,
            totalPrice: 0,

            fetchCart: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                try {
                    startLoading("cart-fetch");

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    const { data, error } = await supabase
                        .from("cart")
                        .select(
                            `
                            product_id, 
                            quantity, 
                            product:product_id(
                                name, 
                                price, 
                                product_image(
                                    image_url,
                                    is_main
                                )
                            )
                        `
                        )
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });

                    if (error) {
                        console.error("Fetch cart error:", error);
                        return;
                    }

                    const cart: CartItem[] = (data || []).map((item: any) => ({
                        id: item.product_id,
                        name: item.product.name,
                        price: item.product.price,
                        image:
                            item.product.product_image?.find(
                                (img: any) => img.is_main
                            )?.image_url ||
                            item.product.product_image?.[0]?.image_url ||
                            "",
                        quantity: item.quantity,
                    }));

                    set({
                        cart,
                        totalItems: cart.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                        ),
                        totalPrice: cart.reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                        ),
                    });
                } catch (error) {
                    console.error("Fetch cart error:", error);
                } finally {
                    stopLoading("cart-fetch");
                }
            },

            addToCart: async (item, quantity = 1) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading("cart-add");

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    const { data: existing } = await supabase
                        .from("cart")
                        .select("quantity")
                        .eq("user_id", user.id)
                        .eq("product_id", item.id)
                        .single();

                    if (existing) {
                        await get().updateQuantity(
                            item.id,
                            existing.quantity + quantity
                        );
                    } else {
                        await supabase.from("cart").insert({
                            user_id: user.id,
                            product_id: item.id,
                            quantity,
                        });
                        await get().fetchCart();
                    }
                } catch (error) {
                    console.error("Add to cart error:", error);
                } finally {
                    stopLoading("cart-add");
                }
            },

            updateQuantity: async (productId, quantity) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading(`${"cart-update"}_${productId}`);

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    if (quantity <= 0) {
                        await get().removeFromCart(productId);
                        return;
                    }

                    await supabase
                        .from("cart")
                        .update({ quantity })
                        .eq("user_id", user.id)
                        .eq("product_id", productId);

                    await get().fetchCart();
                } catch (error) {
                    console.error("Update quantity error:", error);
                } finally {
                    stopLoading(`${"cart-update"}_${productId}`);
                }
            },

            removeFromCart: async (productId) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading(`${"cart-remove"}_${productId}`);

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    await supabase
                        .from("cart")
                        .delete()
                        .eq("user_id", user.id)
                        .eq("product_id", productId);

                    await get().fetchCart();
                } catch (error) {
                    console.error("Remove from cart error:", error);
                } finally {
                    stopLoading(`${"cart-remove"}_${productId}`);
                }
            },

            clearCart: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading("cart-clear");

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    await supabase.from("cart").delete().eq("user_id", user.id);

                    set({ cart: [], totalItems: 0, totalPrice: 0 });
                } catch (error) {
                    console.error("Clear cart error:", error);
                } finally {
                    stopLoading("cart-clear");
                }
            },
        }),
        {
            name: "cart-store",
            partialize: (state) => ({
                cart: state.cart,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice,
            }),
        }
    )
);
