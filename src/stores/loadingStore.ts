import { create } from "zustand";

type LoadingState = {
    [key: string]: boolean;
};

type LoadingStore = {
    isLoading: boolean;
    loadingStates: LoadingState;
    startLoading: (key?: string) => void;
    stopLoading: (key?: string) => void;
    isLoadingKey: (key: string) => boolean;
    clearAllLoading: () => void;
};

export const useLoadingStore = create<LoadingStore>((set, get) => ({
    isLoading: false,
    loadingStates: {},

    startLoading: (key?: string) => {
        if (key) {
            set((state) => ({
                loadingStates: {
                    ...state.loadingStates,
                    [key]: true,
                },
                isLoading: true,
            }));
        } else {
            set({ isLoading: true });
        }
    },

    stopLoading: (key?: string) => {
        if (key) {
            set((state) => {
                const newLoadingStates = { ...state.loadingStates };
                delete newLoadingStates[key];

                const hasAnyLoading =
                    Object.values(newLoadingStates).some(Boolean);

                return {
                    loadingStates: newLoadingStates,
                    isLoading: hasAnyLoading,
                };
            });
        } else {
            set({ isLoading: false });
        }
    },

    isLoadingKey: (key: string) => {
        return get().loadingStates[key] || false;
    },

    clearAllLoading: () => {
        set({
            isLoading: false,
            loadingStates: {},
        });
    },
}));
