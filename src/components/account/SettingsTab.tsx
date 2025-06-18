import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsTab = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-medium">Pengaturan</h2>
            </div>

            <div className="p-4">
                <Tabs defaultValue="notifications">
                    <TabsList className="mb-4">
                        <TabsTrigger value="notifications">
                            Notifikasi
                        </TabsTrigger>
                        <TabsTrigger value="security">Keamanan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="notifications">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">
                                        Email tentang Pesanan
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Dapatkan notifikasi tentang status
                                        pesanan Anda
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="toggle toggle-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">
                                        Promosi & Penawaran
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Dapatkan promosi dan penawaran khusus
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="toggle toggle-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">
                                        Ulasan Produk
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Permintaan untuk memberikan ulasan
                                        produk
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="toggle toggle-primary"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="security">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    Ubah Kata Sandi
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kata Sandi Saat Ini
                                        </label>
                                        <Input type="password" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kata Sandi Baru
                                        </label>
                                        <Input type="password" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Konfirmasi Kata Sandi Baru
                                        </label>
                                        <Input type="password" />
                                    </div>

                                    <Button className="mt-2">
                                        Ubah Kata Sandi
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    Verifikasi Dua Faktor
                                </h3>
                                <p className="text-gray-600 mb-3">
                                    Tingkatkan keamanan akun Anda dengan
                                    verifikasi dua faktor.
                                </p>
                                <Button variant="outline">
                                    Aktifkan Verifikasi Dua Faktor
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SettingsTab;