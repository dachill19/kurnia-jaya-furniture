import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddressStore } from "@/stores/addressStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { AddAddressTabSkeleton } from "@/components/main/skeleton/AccountSkeletons";

interface AddAddressTabProps {
    onBack: () => void;
}

const AddAddressTab: React.FC<AddAddressTabProps> = ({ onBack }) => {
    const { addAddress } = useAddressStore();
    const { isLoadingKey } = useLoadingStore();

    const [addressData, setAddressData] = useState({
        recipient: "",
        label: "",
        province: "",
        city: "",
        subdistrict: "",
        village: "",
        zip_code: "",
        full_address: "",
        is_default: false,
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setFieldErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            await addAddress(addressData);
            onBack();
        } catch (error: any) {
            console.error("Gagal menambah alamat:", error);
            setErrorMsg("Gagal menambah alamat. Silakan coba lagi.");
        }
    };

    const isAdding = isLoadingKey("address-add");

    if (isAdding) {
        return <AddAddressTabSkeleton />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b items-center">
                <h2 className="font-medium">Tambah Alamat Baru</h2>
            </div>

            <div className="p-4">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMsg}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Penerima <span className="text-kj-red">*</span>
                        </label>
                        <Input
                            name="recipient"
                            value={addressData.recipient}
                            onChange={handleInputChange}
                            className={fieldErrors.recipient ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            placeholder="Rumah, Kantor, dll"
                            className={fieldErrors.label ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            className={fieldErrors.province ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            className={fieldErrors.city ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            className={fieldErrors.subdistrict ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            className={fieldErrors.village ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            className={fieldErrors.zip_code ? "border-red-500" : ""}
                            disabled={isAdding}
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
                            onChange={handleInputChange}
                            placeholder="Nomor rumah, nama jalan, RT/RW, dll"
                            className={fieldErrors.full_address ? "border-red-500" : ""}
                            disabled={isAdding}
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
                                disabled={isAdding}
                            />
                            Jadikan Alamat Utama
                        </label>
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            disabled={isAdding}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isAdding}
                            className="hover:bg-kj-darkred"
                        >
                            {isAdding ? "Menyimpan..." : "Simpan Alamat"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressTab;
