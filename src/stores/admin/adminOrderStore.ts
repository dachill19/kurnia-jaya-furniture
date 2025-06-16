import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useLoadingStore } from "../loadingStore";
import { useAuthStore } from "../authStore";

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
        price?: number;
        discount_price?: number;
        stock?: number;
        category_id?: string;
        is_hot?: boolean;
        product_image?: {
            id: string;
            product_id: string;
            image_url: string;
            is_main: boolean;
            created_at: string;
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
    zip_code?: string;
    full_address: string;
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
    created_at: string;
    updated_at: string;
    address?: Address;
}

export interface OrderUser {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
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
    order_item?: OrderItem[];
    payment?: Payment;
    shipping?: Shipping;
    user?: OrderUser;
}

export interface OrderStatusUpdate {
    orderId: string;
    newStatus: Order["status"];
    estimatedDelivery?: string;
}

export interface OrderStats {
    totalOrders: number;
    todayOrders: number;
    processingOrders: number;
    todayRevenue: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
}

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    stats: OrderStats | null;
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    statusFilter: Order["status"] | "ALL";

    // Actions
    fetchAllOrders: () => Promise<void>;
    fetchOrderDetail: (orderId: string) => Promise<void>;
    updateOrderStatus: (updateData: OrderStatusUpdate) => Promise<void>;
    fetchOrderStats: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (status: Order["status"] | "ALL") => void;
    clearError: () => void;
    clearCurrentOrder: () => void;

    // Computed
    getFilteredOrders: () => Order[];
}

export const useAdminOrderStore = create<OrderState>()((set, get) => ({
    orders: [],
    currentOrder: null,
    stats: null,
    isLoading: false,
    error: null,
    searchTerm: "",
    statusFilter: "ALL",

    fetchAllOrders: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            set({ isLoading: true, error: null });
            startLoading("admin-orders-fetch");

            const { data: orders, error } = await supabase
                .from("order")
                .select(
                    `
                    *,
                    order_item(
                        id,
                        order_id,
                        product_id,
                        quantity,
                        price,
                        product(
                            id, 
                            name,
                            description,
                            price,
                            discount_price,
                            stock,
                            category_id,
                            is_hot,
                            product_image(
                                id,
                                product_id,
                                image_url,
                                is_main,
                                created_at
                            )
                        )
                    ),
                    payment(*),
                    shipping(
                        *,
                        address(*)
                    ),
                    user(
                        id,
                        name,
                        email,
                        phone,
                        role,
                        created_at,
                        updated_at
                    )
                `
                )
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
            console.error("Admin fetch orders error:", error);
            set({ error: errorMessage, isLoading: false });
        } finally {
            stopLoading("admin-orders-fetch");
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
            startLoading("admin-order-detail-fetch");

            const { data: order, error } = await supabase
                .from("order")
                .select(
                    `
                    *,
                    order_item(
                        id,
                        order_id,
                        product_id,
                        quantity,
                        price,
                        product(
                            id, 
                            name,
                            description,
                            price,
                            discount_price,
                            stock,
                            category_id,
                            is_hot,
                            product_image(
                                id,
                                product_id,
                                image_url,
                                is_main,
                                created_at
                            )
                        )
                    ),
                    payment(*),
                    shipping(
                        *,
                        address(*)
                    ),
                    user(
                        id,
                        name,
                        email,
                        phone,
                        role,
                        created_at,
                        updated_at
                    )
                `
                )
                .eq("id", orderId)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    throw new Error("Order not found");
                }
                throw new Error(
                    `Failed to fetch order detail: ${error.message}`
                );
            }

            set({ currentOrder: order, isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch order detail";
            console.error("Admin fetch order detail error:", error);
            set({ error: errorMessage, isLoading: false, currentOrder: null });
        } finally {
            stopLoading("admin-order-detail-fetch");
        }
    },

    updateOrderStatus: async (updateData: OrderStatusUpdate) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            set({ isLoading: true, error: null });
            startLoading("admin-order-status-update");

            // Update order status
            const { error: orderError } = await supabase
                .from("order")
                .update({
                    status: updateData.newStatus,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", updateData.orderId);

            if (orderError) {
                throw new Error(
                    `Failed to update order status: ${orderError.message}`
                );
            }

            // Update shipping info if provided
            if (updateData.estimatedDelivery) {
                const shippingUpdate: any = {};

                if (updateData.estimatedDelivery) {
                    shippingUpdate.estimated_delivery =
                        updateData.estimatedDelivery;
                }

                if (updateData.newStatus === "SHIPPED") {
                    shippingUpdate.status = "SHIPPED";
                }

                if (updateData.newStatus === "DELIVERED") {
                    shippingUpdate.status = "DELIVERED";
                }

                const { error: shippingError } = await supabase
                    .from("shipping")
                    .update(shippingUpdate)
                    .eq("order_id", updateData.orderId);

                if (shippingError) {
                    console.warn(
                        "Failed to update shipping info:",
                        shippingError.message
                    );
                }
            }

            // Update local state
            const { orders, currentOrder } = get();

            // Update orders list
            const updatedOrders = orders.map((order) =>
                order.id === updateData.orderId
                    ? {
                          ...order,
                          status: updateData.newStatus,
                          updated_at: new Date().toISOString(),
                      }
                    : order
            );

            // Update current order if it's the one being updated
            const updatedCurrentOrder =
                currentOrder?.id === updateData.orderId
                    ? {
                          ...currentOrder,
                          status: updateData.newStatus,
                          updated_at: new Date().toISOString(),
                      }
                    : currentOrder;

            set({
                orders: updatedOrders,
                currentOrder: updatedCurrentOrder,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update order status";
            console.error("Admin update order status error:", error);
            set({ error: errorMessage, isLoading: false });
        } finally {
            stopLoading("admin-order-status-update");
        }
    },

    fetchOrderStats: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            startLoading("admin-order-stats-fetch");

            const today = new Date();
            const startOfDay = new Date(
                today.setHours(0, 0, 0, 0)
            ).toISOString();
            const endOfDay = new Date(
                today.setHours(23, 59, 59, 999)
            ).toISOString();

            // Fetch all orders for stats calculation
            const { data: allOrders, error: allOrdersError } = await supabase
                .from("order")
                .select("id, total_amount, status, created_at");

            if (allOrdersError) {
                throw new Error(
                    `Failed to fetch order stats: ${allOrdersError.message}`
                );
            }

            // Fetch today's orders
            const { data: todayOrders, error: todayOrdersError } =
                await supabase
                    .from("order")
                    .select("id, total_amount")
                    .gte("created_at", startOfDay)
                    .lte("created_at", endOfDay);

            if (todayOrdersError) {
                throw new Error(
                    `Failed to fetch today's orders: ${todayOrdersError.message}`
                );
            }

            // Calculate stats
            const stats: OrderStats = {
                totalOrders: allOrders?.length || 0,
                todayOrders: todayOrders?.length || 0,
                processingOrders:
                    allOrders?.filter((order) => order.status === "PROCESSING")
                        .length || 0,
                todayRevenue:
                    todayOrders?.reduce(
                        (sum, order) => sum + (order.total_amount || 0),
                        0
                    ) || 0,
                pendingOrders:
                    allOrders?.filter((order) => order.status === "PENDING")
                        .length || 0,
                shippedOrders:
                    allOrders?.filter((order) => order.status === "SHIPPED")
                        .length || 0,
                deliveredOrders:
                    allOrders?.filter((order) => order.status === "DELIVERED")
                        .length || 0,
                cancelledOrders:
                    allOrders?.filter((order) => order.status === "CANCELLED")
                        .length || 0,
            };

            set({ stats });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch order stats";
            console.error("Admin fetch order stats error:", error);
            set({ error: errorMessage });
        } finally {
            stopLoading("admin-order-stats-fetch");
        }
    },

    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
    },

    setStatusFilter: (status: Order["status"] | "ALL") => {
        set({ statusFilter: status });
    },

    getFilteredOrders: () => {
        const { orders, searchTerm, statusFilter } = get();

        return orders.filter((order) => {
            // Status filter
            if (statusFilter !== "ALL" && order.status !== statusFilter) {
                return false;
            }

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    order.id.toLowerCase().includes(searchLower) ||
                    order.user?.name?.toLowerCase().includes(searchLower) ||
                    order.user?.email?.toLowerCase().includes(searchLower) ||
                    order.order_item?.some((item) =>
                        item.product?.name?.toLowerCase().includes(searchLower)
                    )
                );
            }

            return true;
        });
    },

    clearError: () => {
        set({ error: null });
    },

    clearCurrentOrder: () => {
        set({ currentOrder: null });
    },
}));
