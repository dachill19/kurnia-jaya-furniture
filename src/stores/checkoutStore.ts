import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./authStore";
import { useCartStore } from "./cartStore";

export interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
}

export interface ShippingData {
    address_id: string; // Reference to address table
    estimated_delivery: string;
}

export interface CreateOrderData {
    user_id: string;
    total_amount: number;
    status:
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED";
    shipping_data: ShippingData;
    order_items: OrderItem[];
    payment_data: {
        method: string;
        amount: number;
        status: "PENDING" | "COMPLETED" | "FAILED";
        transaction_id?: string;
    };
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface CheckoutState {
    currentOrder: Order | null;
    isProcessing: boolean;
    error: string | null;

    createOrder: (
        orderData: Omit<CreateOrderData, "user_id">
    ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
    clearCurrentOrder: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
    currentOrder: null,
    isProcessing: false,
    error: null,

    createOrder: async (orderData) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();
        const { clearCart } = useCartStore.getState();

        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        try {
            set({ isProcessing: true, error: null });
            startLoading("checkout-create-order");

            // 1. Create order record
            const { data: newOrder, error: orderError } = await supabase
                .from("order")
                .insert({
                    user_id: user.id,
                    total_amount: orderData.total_amount,
                    status: orderData.status,
                })
                .select()
                .single();

            if (orderError) {
                throw new Error(
                    `Failed to create order: ${orderError.message}`
                );
            }

            // 2. Create shipping record with address_id reference
            const { error: shippingError } = await supabase
                .from("shipping")
                .insert({
                    order_id: newOrder.id,
                    address_id: orderData.shipping_data.address_id, // Reference to address table
                    estimated_delivery:
                        orderData.shipping_data.estimated_delivery,
                    status: "PENDING",
                });

            if (shippingError) {
                // Rollback: delete the created order
                await supabase.from("order").delete().eq("id", newOrder.id);
                throw new Error(
                    `Failed to create shipping record: ${shippingError.message}`
                );
            }

            // 3. Insert order items
            const orderItemsWithOrderId = orderData.order_items.map((item) => ({
                order_id: newOrder.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabase
                .from("order_item")
                .insert(orderItemsWithOrderId);

            if (itemsError) {
                // Rollback: delete order and shipping
                await supabase
                    .from("shipping")
                    .delete()
                    .eq("order_id", newOrder.id);
                await supabase.from("order").delete().eq("id", newOrder.id);
                throw new Error(
                    `Failed to create order items: ${itemsError.message}`
                );
            }

            // 4. Create payment record
            const { error: paymentError } = await supabase
                .from("payment")
                .insert({
                    order_id: newOrder.id,
                    amount: orderData.payment_data.amount,
                    method: orderData.payment_data.method,
                    status: orderData.payment_data.status,
                    transaction_id:
                        orderData.payment_data.transaction_id || null,
                });

            if (paymentError) {
                // Rollback: delete order, shipping, and order items
                await supabase
                    .from("order_item")
                    .delete()
                    .eq("order_id", newOrder.id);
                await supabase
                    .from("shipping")
                    .delete()
                    .eq("order_id", newOrder.id);
                await supabase.from("order").delete().eq("id", newOrder.id);
                throw new Error(
                    `Failed to create payment record: ${paymentError.message}`
                );
            }

            // 5. Create order status history record
            const { error: statusHistoryError } = await supabase
                .from("order_status_history")
                .insert({
                    order_id: newOrder.id,
                    status: "PENDING",
                    created_at: new Date().toISOString(),
                });

            if (statusHistoryError) {
                // Rollback: delete order, shipping, order items, and payment
                await supabase
                    .from("payment")
                    .delete()
                    .eq("order_id", newOrder.id);
                await supabase
                    .from("order_item")
                    .delete()
                    .eq("order_id", newOrder.id);
                await supabase
                    .from("shipping")
                    .delete()
                    .eq("order_id", newOrder.id);
                await supabase.from("order").delete().eq("id", newOrder.id);
                throw new Error(
                    `Failed to create order status history: ${statusHistoryError.message}`
                );
            }

            // Clear cart after successful order creation
            await clearCart();

            set({
                currentOrder: newOrder,
                isProcessing: false,
            });

            return {
                success: true,
                orderId: newOrder.id,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to create order";
            console.error("Create order error:", error);

            set({
                error: errorMessage,
                isProcessing: false,
            });

            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            stopLoading("checkout-create-order");
        }
    },

    clearCurrentOrder: () => {
        set({
            currentOrder: null,
            error: null,
        });
    },
}));
