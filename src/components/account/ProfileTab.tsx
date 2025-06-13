import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "@/components/ui/use-toast";
import { ProfileTabSkeleton } from "@/components/skeleton/AccountSkeletons";

const ProfileTab: React.FC = () => {
    const { toast } = useToast();
    const { user, updateProfile } = useAuthStore();
    const { isLoadingKey } = useLoadingStore();

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
        {}
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
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

        if (!userData.name.trim()) {
            errors.name = "Nama lengkap wajib diisi";
        } else if (userData.name.length > 50) {
            errors.name = "Nama tidak boleh lebih dari 50 karakter";
        }

        if (userData.phone && !/^[0-9+\-\s()]+$/.test(userData.phone)) {
            errors.phone = "Format nomor telepon tidak valid";
        }

        return errors;
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setFieldErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            await updateProfile({
                name: userData.name,
                phone: userData.phone,
            });
            setIsEditing(false);

            toast({
                title: "Profil Anda telah berhasil diperbarui",
            });
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setErrorMsg("Gagal memperbarui profil. Silakan coba lagi.");
        }
    };

    const handleCancelEdit = () => {
        setUserData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });
        setIsEditing(false);
        setErrorMsg("");
        setFieldErrors({});
    };

    const isProfileLoading = isLoadingKey("update-profile");

    if (!user && !isProfileLoading) {
        return <div className="text-center py-8">Tidak ada data pengguna.</div>;
    }

    if (isProfileLoading) {
        return <ProfileTabSkeleton />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">Profil Saya</h2>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={isProfileLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveProfile}
                                disabled={isProfileLoading}
                                className="hover:bg-kj-darkred"
                            >
                                {isProfileLoading ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="hover:bg-kj-darkred"
                        >
                            Edit
                        </Button>
                    )}
                </div>
            </div>

            <div className="p-4">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap{" "}
                                <span className="text-kj-red">*</span>
                            </label>
                            {isEditing ? (
                                <Input
                                    name="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    className={
                                        fieldErrors.name ? "border-red-500" : ""
                                    }
                                    disabled={isProfileLoading}
                                />
                            ) : (
                                <p className="text-gray-900 py-2">
                                    {userData.name || "-"}
                                </p>
                            )}
                            {fieldErrors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Telepon
                            </label>
                            {isEditing ? (
                                <Input
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    className={
                                        fieldErrors.phone
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isProfileLoading}
                                    placeholder="Contoh: +62812345678"
                                />
                            ) : (
                                <p className="text-gray-900 py-2">
                                    {userData.phone || "-"}
                                </p>
                            )}
                            {fieldErrors.phone && (
                                <p className="text-sm text-red-600 mt-1">
                                    {fieldErrors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <p className="text-gray-900 py-2">{userData.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Email tidak dapat diubah
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileTab;
