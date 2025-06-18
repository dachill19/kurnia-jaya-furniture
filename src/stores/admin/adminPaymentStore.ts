import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useLoadingStore } from "../loadingStore";
import { useAuthStore } from "../authStore";

export interface PaymentUser {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
}

export interface PaymentOrder {
    id: string;
    user_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    user?: PaymentUser;
}

export interface Payment {
    id: string;
    order_id: string;
    amount: number;
    method: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    transaction_id?: string;
    created_at: string;
    updated_at: string;
    order?: PaymentOrder;
}

export interface PaymentStats {
    todayTotal: number;
    pendingAmount: number;
    pendingCount: number;
    successAmount: number;
    successGrowth: string;
    failedAmount: number;
    failedCount: number;
    monthlyTotal: number;
    weeklyGrowth: string;
}

export interface PaymentStatusUpdate {
    paymentId: string;
    newStatus: Payment["status"];
    notes?: string;
}

interface PaymentState {
    payments: Payment[];
    currentPayment: Payment | null;
    stats: PaymentStats | null;
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    statusFilter: Payment["status"] | "ALL";

    fetchAllPayments: () => Promise<void>;
    fetchPaymentDetail: (paymentId: string) => Promise<void>;
    fetchPaymentStats: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    clearError: () => void;
    clearCurrentPayment: () => void;
    refreshData: () => Promise<void>;

    getFilteredPayments: () => Payment[];
    exportPaymentsCSV: () => void;
}

export const useAdminPaymentStore = create<PaymentState>()((set, get) => ({
    payments: [],
    currentPayment: null,
    stats: null,
    isLoading: false,
    error: null,
    searchTerm: "",
    statusFilter: "ALL",

    fetchAllPayments: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            set({ isLoading: true, error: null });
            startLoading("admin-payments-fetch");

            const { data: payments, error } = await supabase
                .from("payment")
                .select(
                    `
                    *,
                    order(
                        id,
                        user_id,
                        total_amount,
                        status,
                        created_at,
                        updated_at,
                        user(
                            id,
                            name,
                            email,
                            phone
                        )
                    )
                `
                )
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch payments: ${error.message}`);
            }

            set({ payments: payments || [], isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch payments";
            console.error("Admin fetch payments error:", error);
            set({ error: errorMessage, isLoading: false });
        } finally {
            stopLoading("admin-payments-fetch");
        }
    },

    fetchPaymentDetail: async (paymentId: string) => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            set({ isLoading: true, error: null, currentPayment: null });
            startLoading("admin-payment-detail-fetch");

            const { data: payment, error } = await supabase
                .from("payment")
                .select(
                    `
                    *,
                    order(
                        id,
                        user_id,
                        total_amount,
                        status,
                        created_at,
                        updated_at,
                        user(
                            id,
                            name,
                            email,
                            phone
                        )
                    )
                `
                )
                .eq("id", paymentId)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    throw new Error("Payment not found");
                }
                throw new Error(
                    `Failed to fetch payment detail: ${error.message}`
                );
            }

            set({ currentPayment: payment, isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch payment detail";
            console.error("Admin fetch payment detail error:", error);
            set({
                error: errorMessage,
                isLoading: false,
                currentPayment: null,
            });
        } finally {
            stopLoading("admin-payment-detail-fetch");
        }
    },

    fetchPaymentStats: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        const { user } = useAuthStore.getState();

        if (!user) {
            set({ error: "User not authenticated" });
            return;
        }

        try {
            startLoading("admin-payment-stats-fetch");

            const today = new Date();
            const startOfDay = new Date(
                today.setHours(0, 0, 0, 0)
            ).toISOString();
            const endOfDay = new Date(
                today.setHours(23, 59, 59, 999)
            ).toISOString();

            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            ).toISOString();
            const startOfLastWeek = new Date(
                today.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString();

            const { data: allPayments, error: allPaymentsError } =
                await supabase
                    .from("payment")
                    .select("id, amount, status, created_at");

            if (allPaymentsError) {
                throw new Error(
                    `Failed to fetch payment stats: ${allPaymentsError.message}`
                );
            }

            const { data: todayPayments, error: todayPaymentsError } =
                await supabase
                    .from("payment")
                    .select("id, amount, status")
                    .gte("created_at", startOfDay)
                    .lte("created_at", endOfDay);

            if (todayPaymentsError) {
                throw new Error(
                    `Failed to fetch today's payments: ${todayPaymentsError.message}`
                );
            }

            const { data: monthlyPayments, error: monthlyPaymentsError } =
                await supabase
                    .from("payment")
                    .select("id, amount, status")
                    .gte("created_at", startOfMonth);

            if (monthlyPaymentsError) {
                throw new Error(
                    `Failed to fetch monthly payments: ${monthlyPaymentsError.message}`
                );
            }

            const { data: lastWeekPayments, error: lastWeekPaymentsError } =
                await supabase
                    .from("payment")
                    .select("id, amount, status")
                    .gte("created_at", startOfLastWeek)
                    .lt("created_at", startOfDay);

            if (lastWeekPaymentsError) {
                console.warn(
                    "Failed to fetch last week's payments:",
                    lastWeekPaymentsError.message
                );
            }

            const todaySuccessPayments =
                todayPayments?.filter((p) => p.status === "SUCCESS") || [];
            const pendingPayments =
                allPayments?.filter((p) => p.status === "PENDING") || [];
            const successPayments =
                monthlyPayments?.filter((p) => p.status === "SUCCESS") || [];
            const failedPayments =
                allPayments?.filter((p) => p.status === "FAILED") || [];
            const lastWeekSuccessPayments =
                lastWeekPayments?.filter((p) => p.status === "SUCCESS") || [];

            const todayTotal = todaySuccessPayments.reduce(
                (sum, p) => sum + (p.amount || 0),
                0
            );
            const monthlySuccessTotal = successPayments.reduce(
                (sum, p) => sum + (p.amount || 0),
                0
            );
            const lastWeekTotal = lastWeekSuccessPayments.reduce(
                (sum, p) => sum + (p.amount || 0),
                0
            );

            const weeklyGrowthPercent =
                lastWeekTotal > 0
                    ? (
                          ((todayTotal - lastWeekTotal) / lastWeekTotal) *
                          100
                      ).toFixed(1)
                    : "0";

            const stats: PaymentStats = {
                todayTotal,
                pendingAmount: pendingPayments.reduce(
                    (sum, p) => sum + (p.amount || 0),
                    0
                ),
                pendingCount: pendingPayments.length,
                successAmount: monthlySuccessTotal,
                successGrowth: `+${weeklyGrowthPercent}% dari minggu lalu`,
                failedAmount: failedPayments.reduce(
                    (sum, p) => sum + (p.amount || 0),
                    0
                ),
                failedCount: failedPayments.length,
                monthlyTotal: monthlySuccessTotal,
                weeklyGrowth: `${weeklyGrowthPercent}%`,
            };

            set({ stats });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch payment stats";
            console.error("Admin fetch payment stats error:", error);
            set({ error: errorMessage });
        } finally {
            stopLoading("admin-payment-stats-fetch");
        }
    },

    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
    },

    getFilteredPayments: () => {
        const { payments, searchTerm, statusFilter } = get();

        return payments.filter((payment) => {
            if (statusFilter !== "ALL" && payment.status !== statusFilter) {
                return false;
            }

            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    payment.id.toLowerCase().includes(searchLower) ||
                    payment.order?.id.toLowerCase().includes(searchLower) ||
                    payment.order?.user?.name
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    payment.order?.user?.email
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    payment.transaction_id
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    payment.method.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    },

    exportPaymentsCSV: () => {
        const { payments } = get();

        const headers = [
            "ID Pembayaran",
            "ID Pesanan",
            "Pelanggan",
            "Email",
            "Jumlah",
            "Metode",
            "Status",
            "ID Transaksi",
            "Tanggal Dibuat",
            "Tanggal Update",
        ];

        const csvContent = [
            headers.join(","),
            ...payments.map((payment) =>
                [
                    payment.id,
                    payment.order?.id || "",
                    payment.order?.user?.name || "",
                    payment.order?.user?.email || "",
                    payment.amount,
                    payment.method,
                    payment.status,
                    payment.transaction_id || "",
                    new Date(payment.created_at).toLocaleDateString("id-ID"),
                    payment.updated_at
                        ? new Date(payment.updated_at).toLocaleDateString(
                              "id-ID"
                          )
                        : "Belum diupdate",
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-pembayaran-${
            new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    clearError: () => {
        set({ error: null });
    },

    clearCurrentPayment: () => {
        set({ currentPayment: null });
    },

    refreshData: async () => {
        await Promise.all([
            get().fetchAllPayments(),
            get().fetchPaymentStats(),
        ]);
    },
}));
