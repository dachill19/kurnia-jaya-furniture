import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./authStore";

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    product?: {
        id: string;
        name: string;
        product_image?: {
            image_url: string;
            is_main: boolean;
        }[];
    };
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status:
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED";
    created_at: string;
    order_items?: OrderItem[];
}

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchUserOrders: () => Promise<void>;
    clearError: () => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchUserOrders: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            set({ isLoading: true, error: null });
            startLoading("orders-fetch");

            const { data: orders, error } = await supabase
                .from("order")
                .select(
                    `
                    *,
                    order_items:order_item(
                        id,
                        order_id,
                        product_id,
                        quantity,
                        price,
                        product(
                            id, 
                            name,
                            product_image(
                                image_url,
                                is_main
                            )
                        )
                    )
                `
                )
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch orders: ${error.message}`);
            }

            set({ orders: orders || [], isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch orders";
            console.error("Fetch orders error:", error);
            set({ error: errorMessage, isLoading: false });
        } finally {
            stopLoading("orders-fetch");
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
