import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./authStore";

export interface Address {
    id: string;
    user_id: string;
    recipient: string;
    label: string;
    province: string;
    city: string;
    subdistrict: string;
    village: string;
    zip_code: string;
    full_address: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateAddressData {
    recipient: string;
    label: string;
    province: string;
    city: string;
    subdistrict: string;
    village: string;
    zip_code: string;
    full_address: string;
    is_default?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
    id: string;
}

interface AddressState {
    addresses: Address[];
    defaultAddress: Address | null;

    fetchAddresses: () => Promise<void>;
    addAddress: (addressData: CreateAddressData) => Promise<void>;
    updateAddress: (addressData: UpdateAddressData) => Promise<void>;
    deleteAddress: (addressId: string) => Promise<void>;
    setDefaultAddress: (addressId: string) => Promise<void>;
    getAddressById: (addressId: string) => Address | undefined;
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set, get) => ({
            addresses: [],
            defaultAddress: null,

            fetchAddresses: async () => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading("address-fetch");

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    const { data, error } = await supabase
                        .from("address")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });

                    if (error) {
                        console.error("Fetch addresses error:", error);
                        return;
                    }

                    const addresses = data || [];
                    const defaultAddress =
                        addresses.find((addr) => addr.is_default) || null;

                    set({
                        addresses,
                        defaultAddress,
                    });
                } catch (error) {
                    console.error("Fetch addresses error:", error);
                } finally {
                    stopLoading("address-fetch");
                }
            },

            addAddress: async (addressData) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading("address-add");

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    // If this is set as default, unset other default addresses first
                    if (addressData.is_default) {
                        await supabase
                            .from("address")
                            .update({ is_default: false })
                            .eq("user_id", user.id);
                    }

                    const { error } = await supabase.from("address").insert({
                        user_id: user.id,
                        ...addressData,
                    });

                    if (error) {
                        console.error("Add address error:", error);
                        return;
                    }

                    await get().fetchAddresses();
                } catch (error) {
                    console.error("Add address error:", error);
                } finally {
                    stopLoading("address-add");
                }
            },

            updateAddress: async (addressData) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading(`address-update_${addressData.id}`);

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    const { id, ...updateData } = addressData;

                    // If this is set as default, unset other default addresses first
                    if (updateData.is_default) {
                        await supabase
                            .from("address")
                            .update({ is_default: false })
                            .eq("user_id", user.id)
                            .neq("id", id);
                    }

                    const { error } = await supabase
                        .from("address")
                        .update(updateData)
                        .eq("id", id)
                        .eq("user_id", user.id);

                    if (error) {
                        console.error("Update address error:", error);
                        return;
                    }

                    await get().fetchAddresses();
                } catch (error) {
                    console.error("Update address error:", error);
                } finally {
                    stopLoading(`address-update_${addressData.id}`);
                }
            },

            deleteAddress: async (addressId) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading(`address-delete_${addressId}`);

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    const { error } = await supabase
                        .from("address")
                        .delete()
                        .eq("id", addressId)
                        .eq("user_id", user.id);

                    if (error) {
                        console.error("Delete address error:", error);
                        return;
                    }

                    await get().fetchAddresses();
                } catch (error) {
                    console.error("Delete address error:", error);
                } finally {
                    stopLoading(`address-delete_${addressId}`);
                }
            },

            setDefaultAddress: async (addressId) => {
                const { startLoading, stopLoading } =
                    useLoadingStore.getState();

                try {
                    startLoading(`address-set-default_${addressId}`);

                    const { user } = useAuthStore.getState();
                    if (!user) return;

                    // First, unset all default addresses
                    await supabase
                        .from("address")
                        .update({ is_default: false })
                        .eq("user_id", user.id);

                    // Then set the selected address as default
                    const { error } = await supabase
                        .from("address")
                        .update({ is_default: true })
                        .eq("id", addressId)
                        .eq("user_id", user.id);

                    if (error) {
                        console.error("Set default address error:", error);
                        return;
                    }

                    await get().fetchAddresses();
                } catch (error) {
                    console.error("Set default address error:", error);
                } finally {
                    stopLoading(`address-set-default_${addressId}`);
                }
            },

            getAddressById: (addressId) => {
                const { addresses } = get();
                return addresses.find((address) => address.id === addressId);
            },
        }),
        {
            name: "address-store",
            partialize: (state) => ({
                addresses: state.addresses,
                defaultAddress: state.defaultAddress,
            }),
        }
    )
);
