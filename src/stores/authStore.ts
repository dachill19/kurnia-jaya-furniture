import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";

type User = {
    id: string;
    email: string;
    name?: string;
    phone?: string;
};

type AuthStore = {
    user: User | null;
    isInitialized: boolean;
    fetchProfile: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        name: string,
        phone?: string
    ) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isInitialized: false,

            initialize: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("auth-initialize");
                try {
                    const {
                        data: { session },
                        error,
                    } = await supabase.auth.getSession();

                    if (session?.user && !error) {
                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email || "",
                                name: session.user.user_metadata?.name || "",
                                phone: session.user.phone || "",
                            },
                            isInitialized: true,
                        });
                    } else {
                        set({ user: null, isInitialized: true });
                    }
                } catch (error) {
                    console.error("Error initializing auth:", error);
                    set({ user: null, isInitialized: true });
                } finally {
                    stopLoading("auth-initialize");
                }
            },

            fetchProfile: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("fetch-profile");
                try {
                    const {
                        data: { user },
                        error,
                    } = await supabase.auth.getUser();

                    if (user && !error) {
                        set({
                            user: {
                                id: user.id,
                                email: user.email || "",
                                name: user.user_metadata?.name || "",
                                phone: user.phone || "",
                            },
                            isInitialized: true,
                        });
                    } else {
                        set({ user: null, isInitialized: true });
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    set({ user: null, isInitialized: true });
                } finally {
                    stopLoading("fetch-profile");
                }
            },

            login: async (email, password) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("auth-login");
                try {
                    const { data, error } =
                        await supabase.auth.signInWithPassword({
                            email,
                            password,
                        });
                    if (error) throw error;

                    if (data.user) {
                        set({
                            user: {
                                id: data.user.id,
                                email: data.user.email || "",
                                name: data.user.user_metadata?.name || "",
                                phone: data.user.phone || "",
                            },
                        });
                    }
                } finally {
                    stopLoading("auth-login");
                }
            },

            register: async (email, password, name, phone) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("auth-register");
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                name,
                                phone,
                            },
                        },
                    });
                    if (error) throw error;

                    if (data.user) {
                        set({
                            user: {
                                id: data.user.id,
                                email: data.user.email || "",
                                name: data.user.user_metadata?.name || name,
                                phone: data.user.phone || phone || "",
                            },
                        });
                    }
                } finally {
                    stopLoading("auth-register");
                }
            },

            updateProfile: async (data) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("update-profile");
                try {
                    const { error } = await supabase.auth.updateUser({
                        data: {
                            name: data.name,
                            phone: data.phone,
                        },
                    });
                    if (error) throw error;

                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: {
                                ...currentUser,
                                ...data,
                            },
                        });
                    }
                } finally {
                    stopLoading("update-profile");
                }
            },

            logout: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();
                startLoading("auth-logout");
                try {
                    await supabase.auth.signOut();
                    set({ user: null });
                } finally {
                    stopLoading("auth-logout");
                }
            },
        }),
        {
            name: "auth-store",
            partialize: (state) => ({
                user: state.user,
                // Don't persist isInitialized as it should reset on page load
            }),
        }
    )
);
