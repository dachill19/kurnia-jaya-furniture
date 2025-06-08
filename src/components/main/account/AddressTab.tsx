import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AddressTabProps {
    apiService: any;
    onEditAddress: (address: any) => void;
}

const AddressTab: React.FC<AddressTabProps> = ({
    apiService,
    onEditAddress,
}) => {
    const { toast } = useToast();
    const [addresses, setAddresses] = useState([]);

    const fetchAddresses = async () => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        try {
            const res = await apiService.getAddresses(token);

            if (res.data.success) {
                setAddresses(res.data.addresses.filter((a: any) => a));
            }
        } catch (error) {
            console.error("Gagal ambil alamat:", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleDeleteAddress = async (id: string) => {
        if (confirm("Yakin ingin menghapus alamat ini?")) {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            try {
                await apiService.deleteAddress(id, token);
                await fetchAddresses();
            } catch (err) {
                console.error("Gagal hapus alamat:", err);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">Alamat Saya</h2>
                <Button size="sm">Tambah Alamat Baru</Button>
            </div>

            <div className="p-4 space-y-4">
                {addresses.length === 0 ? (
                    <p className="text-gray-500">Belum ada alamat tersimpan.</p>
                ) : (
                    addresses
                        .filter(
                            (address: any) =>
                                address !== undefined && address !== null
                        )
                        .map((address: any) => (
                            <div
                                key={address.id}
                                className="border rounded-md p-4 relative"
                            >
                                {address.isDefault && (
                                    <div className="absolute top-4 right-4 bg-kj-red text-white text-xs px-2 py-1 rounded-full">
                                        Utama
                                    </div>
                                )}

                                <h3 className="font-medium mb-2">
                                    {address.recipient}
                                </h3>
                                <p className="text-gray-600">
                                    {address.fullAddress}
                                </p>
                                <p className="text-gray-600">
                                    {address.village}, {address.subdistrict},{" "}
                                    {address.city}, {address.province}
                                </p>
                                <p className="text-gray-600">
                                    {address.zipCode}
                                </p>
                                <p className="text-gray-600">{address.label}</p>

                                <div className="flex space-x-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditAddress(address)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() =>
                                            handleDeleteAddress(address.id)
                                        }
                                    >
                                        Hapus
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
