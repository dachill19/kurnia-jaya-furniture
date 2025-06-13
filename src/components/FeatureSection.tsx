import { Truck, CreditCard, RotateCcw, Phone } from "lucide-react";

const features = [
    {
        id: 1,
        icon: Truck,
        title: "Pengiriman Cepat",
        description: "Pengiriman ke seluruh Indonesia",
    },
    {
        id: 2,
        icon: CreditCard,
        title: "Pembayaran Aman",
        description: "Berbagai metode pembayaran",
    },
    {
        id: 3,
        icon: RotateCcw,
        title: "Garansi 30 Hari",
        description: "Jaminan kepuasan pelanggan",
    },
    {
        id: 4,
        icon: Phone,
        title: "Layanan 24/7",
        description: "Dukungan pelanggan kapan saja",
    },
];

const FeatureSection = () => {
    return (
        <section className="bg-gray-50 py-12">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="bg-kj-red/10 p-3 rounded-full mb-4">
                                    <Icon size={24} className="text-kj-red" />
                                </div>
                                <h3 className="font-serif font-bold text-lg mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
