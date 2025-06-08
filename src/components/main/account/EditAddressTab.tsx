import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditAddressTabProps {
    selectedAddress: any;
    updateAddress: (data: any) => Promise<void>;
}

const EditAddressTab: React.FC<EditAddressTabProps> = ({
    selectedAddress,
    updateAddress,
}) => {
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressData, setAddressData] = useState({
        recipient: selectedAddress?.recipient || "",
        label: selectedAddress?.label || "",
        province: selectedAddress?.province || "",
        city: selectedAddress?.city || "",
        subdistrict: selectedAddress?.subdistrict || "",
        village: selectedAddress?.village || "",
        zipCode: selectedAddress?.zipCode || "",
        fullAddress: selectedAddress?.fullAddress || "",
        isDefault: selectedAddress?.isDefault || false,
    });

    const handleInputAddressChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setAddressData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAddress(addressData);
            setIsEditingAddress(false);
        } catch (error) {
            console.error("Gagal update alamat:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">Edit Alamat</h2>
                <Button
                    variant={isEditingAddress ? "outline" : "default"}
                    size="sm"
                    onClick={(e) => {
                        if (isEditingAddress) {
                            handleSaveAddress(e);
                        } else {
                            setIsEditingAddress(true);
                        }
                    }}
                >
                    {isEditingAddress ? "Simpan" : "Edit"}
                </Button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Penerima
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="recipient"
                            value={addressData.recipient}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">{addressData.recipient}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="label"
                            value={addressData.label}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">{addressData.label}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provinsi
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="province"
                            value={addressData.province}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">{addressData.province}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kota/Kabupaten
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="city"
                            value={addressData.city}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">{addressData.city}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kecamatan
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="subdistrict"
                            value={addressData.subdistrict}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">
                            {addressData.subdistrict}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kelurahan/Desa
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="village"
                            value={addressData.village}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">{addressData.village}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kode Pos
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="zipCode"
                            value={addressData.zipCode}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">{addressData.zipCode}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat Lengkap
                    </label>
                    {isEditingAddress ? (
                        <Input
                            name="fullAddress"
                            value={addressData.fullAddress}
                            onChange={handleInputAddressChange}
                        />
                    ) : (
                        <p className="text-gray-900">
                            {addressData.fullAddress}
                        </p>
                    )}
                </div>

                {isEditingAddress ? (
                    <div className="md:col-span-2 flex items-center space-x-2">
                        <label className="inline-flex items-center text-sm">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={addressData.isDefault}
                                onChange={(e) =>
                                    setAddressData((prev) => ({
                                        ...prev,
                                        isDefault: e.target.checked,
                                    }))
                                }
                                className="mr-2"
                            />
                            Jadikan Alamat Utama
                        </label>
                    </div>
                ) : (
                    addressData.isDefault && (
                        <div className="md:col-span-2 flex items-center space-x-2">
                            <p className="text-sm">Alamat utama</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default EditAddressTab;
