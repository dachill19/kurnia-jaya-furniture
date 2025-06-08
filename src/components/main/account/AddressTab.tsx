import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAddressStore } from "@/stores/addressStore";
import { useLoadingStore } from "@/stores/loadingStore";

interface AddressTabProps {
    onEditAddress: (address: any) => void;
    onAddAddress: () => void;
}

const AddressTab: React.FC<AddressTabProps> = ({
    onEditAddress,
    onAddAddress,
}) => {
    const { addresses, fetchAddresses, deleteAddress, setDefaultAddress } =
        useAddressStore();
    const { isLoadingKey } = useLoadingStore();

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleDeleteAddress = async (id: string) => {
        if (confirm("Yakin ingin menghapus alamat ini?")) {
            try {
                await deleteAddress(id);
            } catch (err) {
                console.error("Gagal hapus alamat:", err);
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultAddress(id);
        } catch (err) {
            console.error("Gagal set alamat default:", err);
        }
    };

    const isLoadingAddresses = isLoadingKey("address-fetch");

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">Alamat Saya</h2>
                <Button
                    variant="default"
                    size="sm"
                    onClick={onAddAddress}
                    className="hover:bg-kj-darkred"
                >
                    Tambah Alamat Baru
                </Button>
            </div>

            <div className="p-4 space-y-4">
                {isLoadingAddresses ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kj-red mx-auto mb-4"></div>
                        <p className="text-gray-500">Memuat alamat...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <p className="text-gray-500">Belum ada alamat tersimpan.</p>
                ) : (
                    addresses.map((address) => (
                        <div
                            key={address.id}
                            className="border rounded-md p-4 relative"
                        >
                            {address.is_default && (
                                <div className="absolute top-4 right-4 bg-kj-red text-white text-xs px-2 py-1 rounded-full">
                                    Utama
                                </div>
                            )}

                            <h3 className="font-medium mb-2">
                                {address.recipient}
                            </h3>
                            <p className="text-gray-600">
                                {address.full_address}
                            </p>
                            <p className="text-gray-600">
                                {address.village}, {address.subdistrict},{" "}
                                {address.city}, {address.province}
                            </p>
                            <p className="text-gray-600">{address.zip_code}</p>
                            <p className="text-gray-600">{address.label}</p>

                            <div className="flex space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEditAddress(address)}
                                >
                                    Edit
                                </Button>
                                {!address.is_default && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleSetDefault(address.id)
                                        }
                                        disabled={isLoadingKey(
                                            `address-set-default_${address.id}`
                                        )}
                                    >
                                        {isLoadingKey(
                                            `address-set-default_${address.id}`
                                        )
                                            ? "Loading..."
                                            : "Jadikan Utama"}
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500"
                                    onClick={() =>
                                        handleDeleteAddress(address.id)
                                    }
                                    disabled={isLoadingKey(
                                        `address-delete_${address.id}`
                                    )}
                                >
                                    {isLoadingKey(
                                        `address-delete_${address.id}`
                                    )
                                        ? "Loading..."
                                        : "Hapus"}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressTab;
