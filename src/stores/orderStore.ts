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
        description?: string;
        product_image?: {
            image_url: string;
            is_main: boolean;
        }[];
    };
}

export interface Address {
    id: string;
    user_id: string;
    recipient: string;
    label: string;
    province: string;
    city: string;
    subdistrict: string;
    village: string;
    full_address: string;
    postal_code?: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    order_id: string;
    amount: number;
    method: string;
    status: string;
    transaction_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Shipping {
    id: string;
    order_id: string;
    address_id: string;
    estimated_delivery?: string;
    status: string;
    tracking_number?: string;
    created_at: string;
    updated_at: string;
}

export interface OrderStatusHistory {
    id: string;
    order_id: string;
    status: string;
    created_at: string;
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
    updated_at?: string;
    order_items?: OrderItem[];
    address?: Address;
    payment?: Payment;
    shipping?: Shipping;
    order_status_history?: OrderStatusHistory[];
}

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    fetchUserOrders: () => Promise<void>;
    fetchOrderDetail: (orderId: string) => Promise<void>;
    clearError: () => void;
    clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
    orders: [],
    currentOrder: null,
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
                    ),
                    order_status_history(
                        id,
                        order_id,
                        status,
                        created_at
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

    fetchOrderDetail: async (orderId: string) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            set({ isLoading: true, error: null, currentOrder: null });
            startLoading("order-detail-fetch");

            const { data: order, error } = await supabase
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
                            description,
                            product_image(
                                image_url,
                                is_main
                            )
                        )
                    ),
                    payment(*),
                    shipping(
                        *,
                        address(*)
                    ),
                    order_status_history(
                        id,
                        order_id,
                        status,
                        created_at
                    )
                `
                )
                .eq("id", orderId)
                .eq("user_id", user.id)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    throw new Error("Order not found");
                }
                throw new Error(
                    `Failed to fetch order detail: ${error.message}`
                );
            }

            const transformedOrder = {
                ...order,
                address: order.shipping?.address || null,
                order_status_history:
                    order.order_status_history?.sort(
                        (a: OrderStatusHistory, b: OrderStatusHistory) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    ) || [],
            };

            set({ currentOrder: transformedOrder, isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch order detail";
            console.error("Fetch order detail error:", error);
            set({ error: errorMessage, isLoading: false, currentOrder: null });
        } finally {
            stopLoading("order-detail-fetch");
        }
    },

    clearError: () => {
        set({ error: null });
    },

    clearCurrentOrder: () => {
        set({ currentOrder: null });
    },
}));
