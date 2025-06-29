import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./authStore";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    image: string;
    quantity: number;
    stock: number;
}

interface CartState {
    cart: CartItem[];
    totalItems: number;
    totalPrice: number;

    fetchCart: () => Promise<void>;
    addToCart: (
        item: Omit<CartItem, "quantity">,
        quantity?: number
    ) => Promise<{ success: boolean; message?: string }>;
    updateQuantity: (
        productId: string,
        quantity: number
    ) => Promise<{ success: boolean; message?: string }>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getDisplayPrice: (item: CartItem) => number;
    validateQuantity: (
        stock: number,
        requestedQuantity: number
    ) => { isValid: boolean; message?: string };
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            totalItems: 0,
            totalPrice: 0,

            getDisplayPrice: (item: CartItem) => {
                return item.discount_price && item.discount_price > 0
                    ? item.discount_price
                    : item.price;
            },

            validateQuantity: (stock: number, requestedQuantity: number) => {
                if (requestedQuantity <= 0) {
                    return {
                        isValid: false,
                        message: "Jumlah harus lebih dari 0",
                    };
                }
                if (requestedQuantity > stock) {
                    return {
                        isValid: false,
                        message: `Stok tidak mencukupi. Stok tersedia: ${stock}`,
                    };
                }
                return { isValid: true };
            },

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
                                discount_price,
                                stock,
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
                        discount_price: item.product.discount_price,
                        stock: item.product.stock || 0,
                        image:
                            item.product.product_image?.find(
                                (img: any) => img.is_main
                            )?.image_url ||
                            item.product.product_image?.[0]?.image_url ||
                            "",
                        quantity: item.quantity,
                    }));

                    const { getDisplayPrice } = get();
                    const totalPrice = cart.reduce((acc, item) => {
                        const displayPrice = getDisplayPrice(item);
                        return acc + displayPrice * item.quantity;
                    }, 0);

                    set({
                        cart,
                        totalItems: cart.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                        ),
                        totalPrice,
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
                    if (!user)
                        return {
                            success: false,
                            message: "User tidak terautentikasi",
                        };

                    const { validateQuantity } = get();
                    const validation = validateQuantity(item.stock, quantity);
                    if (!validation.isValid) {
                        return { success: false, message: validation.message };
                    }

                    const { data: existing } = await supabase
                        .from("cart")
                        .select("quantity")
                        .eq("user_id", user.id)
                        .eq("product_id", item.id)
                        .single();

                    if (existing) {
                        const newQuantity = existing.quantity + quantity;
                        const quantityValidation = validateQuantity(
                            item.stock,
                            newQuantity
                        );
                        if (!quantityValidation.isValid) {
                            return {
                                success: false,
                                message: quantityValidation.message,
                            };
                        }

                        const result = await get().updateQuantity(
                            item.id,
                            newQuantity
                        );
                        return result;
                    } else {
                        await supabase.from("cart").insert({
                            user_id: user.id,
                            product_id: item.id,
                            quantity,
                        });
                        await get().fetchCart();
                        return { success: true };
                    }
                } catch (error) {
                    console.error("Add to cart error:", error);
                    return {
                        success: false,
                        message: "Gagal menambahkan ke keranjang",
                    };
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
                    if (!user)
                        return {
                            success: false,
                            message: "User tidak terautentikasi",
                        };

                    if (quantity <= 0) {
                        await get().removeFromCart(productId);
                        return { success: true };
                    }

                    const { cart, validateQuantity } = get();
                    const cartItem = cart.find((item) => item.id === productId);

                    if (cartItem) {
                        const validation = validateQuantity(
                            cartItem.stock,
                            quantity
                        );
                        if (!validation.isValid) {
                            return {
                                success: false,
                                message: validation.message,
                            };
                        }
                    }

                    await supabase
                        .from("cart")
                        .update({ quantity })
                        .eq("user_id", user.id)
                        .eq("product_id", productId);

                    await get().fetchCart();
                    return { success: true };
                } catch (error) {
                    console.error("Update quantity error:", error);
                    return {
                        success: false,
                        message: "Gagal mengupdate jumlah",
                    };
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
