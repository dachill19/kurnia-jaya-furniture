import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useLoadingStore } from "../loadingStore";

type User = {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role: "USER" | "ADMIN";
    created_at: string;
    last_sign_in?: string;
};

type UserStats = {
    totalUsers: number;
    activeToday: number;
    newThisMonth: number;
};

type UserStore = {
    users: User[];
    stats: UserStats;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchUsers: () => Promise<void>;
    fetchUserStats: () => Promise<void>;
    searchUsers: (searchTerm: string) => User[];
    exportUsers: () => void;
    refreshData: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    stats: {
        totalUsers: 0,
        activeToday: 0,
        newThisMonth: 0,
    },
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading("fetch-users");
        set({ isLoading: true, error: null });

        try {
            // First get users from user table
            const { data: userData, error: userError } = await supabase
                .from("user")
                .select("*")
                .order("created_at", { ascending: false });

            if (userError) throw userError;

            // Then get auth data for each user
            const usersWithAuth = await Promise.all(
                (userData || []).map(async (user) => {
                    const { data: authData, error: authError } =
                        await supabase.auth.admin.getUserById(user.id);

                    return {
                        ...user,
                        last_sign_in: authData?.user?.last_sign_in_at || null,
                    };
                })
            );

            set({ users: usersWithAuth });
        } catch (error) {
            console.error("Error fetching users:", error);
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch users",
            });
        } finally {
            set({ isLoading: false });
            stopLoading("fetch-users");
        }
    },

    fetchUserStats: async () => {
        const { startLoading, stopLoading } = useLoadingStore.getState();
        startLoading("fetch-user-stats");

        try {
            // Get total users
            const { count: totalUsers, error: totalError } = await supabase
                .from("user")
                .select("*", { count: "exact", head: true });

            if (totalError) throw totalError;

            // Get users created this month
            const currentMonth = new Date();
            const firstDayOfMonth = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                1
            );

            const { count: newThisMonth, error: monthError } = await supabase
                .from("user")
                .select("*", { count: "exact", head: true })
                .gte("created_at", firstDayOfMonth.toISOString());

            if (monthError) throw monthError;

            // Get users who signed in today
            const today = new Date();
            const startOfDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );

            // Get all users first
            const { data: allUsers, error: usersError } = await supabase
                .from("user")
                .select("id");

            if (usersError) throw usersError;

            // Check each user's last sign in from auth
            let activeToday = 0;
            if (allUsers) {
                const activeChecks = await Promise.all(
                    allUsers.map(async (user) => {
                        try {
                            const { data: authData } =
                                await supabase.auth.admin.getUserById(user.id);
                            const lastSignIn = authData?.user?.last_sign_in_at;

                            if (
                                lastSignIn &&
                                new Date(lastSignIn) >= startOfDay
                            ) {
                                return true;
                            }
                            return false;
                        } catch {
                            return false;
                        }
                    })
                );
                activeToday = activeChecks.filter(Boolean).length;
            }

            set({
                stats: {
                    totalUsers: totalUsers || 0,
                    activeToday,
                    newThisMonth: newThisMonth || 0,
                },
            });
        } catch (error) {
            console.error("Error fetching user stats:", error);
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch user stats",
            });
        } finally {
            stopLoading("fetch-user-stats");
        }
    },

    searchUsers: (searchTerm: string) => {
        const { users } = get();
        if (!searchTerm.trim()) return users;

        return users.filter(
            (user) =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },

    exportUsers: () => {
        const { users } = get();

        // Create CSV content
        const headers = [
            "User ID",
            "Nama",
            "Email",
            "Telepon",
            "Role",
            "Tanggal Bergabung",
            "Terakhir Sign In",
        ];
        const csvContent = [
            headers.join(","),
            ...users.map((user) =>
                [
                    user.id,
                    user.name,
                    user.email,
                    user.phone || "",
                    user.role,
                    new Date(user.created_at).toLocaleDateString("id-ID"),
                    user.last_sign_in
                        ? new Date(user.last_sign_in).toLocaleDateString(
                              "id-ID"
                          )
                        : "Belum pernah",
                ].join(",")
            ),
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `data-pengguna-${
            new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    refreshData: async () => {
        await Promise.all([get().fetchUsers(), get().fetchUserStats()]);
    },
}));
