import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddressStore, type Address } from "@/stores/addressStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { EditAddressTabSkeleton } from "@/components/main/skeleton/AccountSkeletons";

interface EditAddressTabProps {
    selectedAddress: Address;
    onBack: () => void;
}

const EditAddressTab: React.FC<EditAddressTabProps> = ({
    selectedAddress,
    onBack,
}) => {
    const { updateAddress } = useAddressStore();
    const { isLoadingKey } = useLoadingStore();

    const [addressData, setAddressData] = useState({
        recipient: selectedAddress?.recipient || "",
        label: selectedAddress?.label || "",
        province: selectedAddress?.province || "",
        city: selectedAddress?.city || "",
        subdistrict: selectedAddress?.subdistrict || "",
        village: selectedAddress?.village || "",
        zip_code: selectedAddress?.zip_code || "",
        full_address: selectedAddress?.full_address || "",
        is_default: selectedAddress?.is_default || false,
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (selectedAddress) {
            setAddressData({
                recipient: selectedAddress.recipient,
                label: selectedAddress.label,
                province: selectedAddress.province,
                city: selectedAddress.city,
                subdistrict: selectedAddress.subdistrict,
                village: selectedAddress.village,
                zip_code: selectedAddress.zip_code,
                full_address: selectedAddress.full_address,
                is_default: selectedAddress.is_default,
            });
        }
    }, [selectedAddress]);

    const handleInputAddressChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setAddressData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!addressData.recipient.trim()) {
            errors.recipient = "Nama penerima wajib diisi";
        } else if (addressData.recipient.length > 50) {
            errors.recipient = "Nama penerima tidak boleh lebih dari 50 karakter";
        }

        if (!addressData.label.trim()) {
            errors.label = "Label alamat wajib diisi";
        } else if (addressData.label.length > 20) {
            errors.label = "Label tidak boleh lebih dari 20 karakter";
        }

        if (!addressData.province.trim()) {
            errors.province = "Provinsi wajib diisi";
        }

        if (!addressData.city.trim()) {
            errors.city = "Kota/Kabupaten wajib diisi";
        }

        if (!addressData.subdistrict.trim()) {
            errors.subdistrict = "Kecamatan wajib diisi";
        }

        if (!addressData.village.trim()) {
            errors.village = "Kelurahan/Desa wajib diisi";
        }

        if (!addressData.zip_code.trim()) {
            errors.zip_code = "Kode pos wajib diisi";
        } else if (!/^\d{5}$/.test(addressData.zip_code)) {
            errors.zip_code = "Kode pos harus 5 digit angka";
        }

        if (!addressData.full_address.trim()) {
            errors.full_address = "Alamat lengkap wajib diisi";
        } else if (addressData.full_address.length < 10) {
            errors.full_address = "Alamat lengkap minimal 10 karakter";
        }

        return errors;
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setFieldErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            await updateAddress({
                id: selectedAddress.id,
                ...addressData,
            });
            onBack();
        } catch (error: any) {
            console.error("Gagal update alamat:", error);
            setErrorMsg("Gagal mengupdate alamat. Silakan coba lagi.");
        }
    };

    const isUpdating = isLoadingKey(`address-update_${selectedAddress.id}`);

    if (isUpdating) {
        return <EditAddressTabSkeleton />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b items-center">
                <h2 className="font-medium">Edit Alamat</h2>
            </div>

            <div className="p-4">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMsg}
                    </div>
                )}

                <form
                    onSubmit={handleSaveAddress}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Penerima <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="recipient"
                            value={addressData.recipient}
                            onChange={handleInputAddressChange}
                            className={fieldErrors.recipient ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.recipient && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.recipient}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Label <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="label"
                            value={addressData.label}
                            onChange={handleInputAddressChange}
                            placeholder="Rumah, Kantor, dll"
                            className={fieldErrors.label ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.label && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.label}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Provinsi <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="province"
                            value={addressData.province}
                            onChange={handleInputAddressChange}
                            className={fieldErrors.province ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.province && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.province}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kota/Kabupaten <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="city"
                            value={addressData.city}
                            onChange={handleInputAddressChange}
                            className={fieldErrors.city ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.city && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kecamatan <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="subdistrict"
                            value={addressData.subdistrict}
                            onChange={handleInputAddressChange}
                            className={fieldErrors.subdistrict ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.subdistrict && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.subdistrict}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kelurahan/Desa <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="village"
                            value={addressData.village}
                            onChange={handleInputAddressChange}
                            className={fieldErrors.village ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.village && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.village}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kode Pos <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="zip_code"
                            value={addressData.zip_code}
                            onChange={handleInputAddressChange}
                            className={fieldErrors.zip_code ? "border-red-500" : ""}
                            disabled={isUpdating}
                            placeholder="12345"
                        />
                        {fieldErrors.zip_code && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.zip_code}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat Lengkap <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="full_address"
                            value={addressData.full_address}
                            onChange={handleInputAddressChange}
                            placeholder="Nomor rumah, nama jalan, RT/RW, dll"
                            className={fieldErrors.full_address ? "border-red-500" : ""}
                            disabled={isUpdating}
                        />
                        {fieldErrors.full_address && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.full_address}</p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex items-center space-x-2">
                        <label className="inline-flex items-center text-sm">
                            <input
                                type="checkbox"
                                name="is_default"
                                checked={addressData.is_default}
                                onChange={(e) =>
                                    setAddressData((prev) => ({
                                        ...prev,
                                        is_default: e.target.checked,
                                    }))
                                }
                                className="mr-2"
                                disabled={isUpdating}
                            />
                            Jadikan Alamat Utama
                        </label>
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            disabled={isUpdating}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="hover:bg-kj-darkred"
                        >
                            {isUpdating ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddressTab;
