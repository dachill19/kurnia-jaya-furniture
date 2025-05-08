import { Truck, CreditCard, RotateCcw, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const features = [
    {
        id: 1,
        icon: Truck,
        title: {
            id: "Pengiriman Cepat",
            en: "Fast Delivery",
        },
        description: {
            id: "Pengiriman ke seluruh Indonesia",
            en: "Delivery across Indonesia",
        },
    },
    {
        id: 2,
        icon: CreditCard,
        title: {
            id: "Pembayaran Aman",
            en: "Secure Payment",
        },
        description: {
            id: "Berbagai metode pembayaran",
            en: "Multiple payment methods",
        },
    },
    {
        id: 3,
        icon: RotateCcw,
        title: {
            id: "Garansi 30 Hari",
            en: "30-Day Warranty",
        },
        description: {
            id: "Jaminan kepuasan pelanggan",
            en: "Customer satisfaction guarantee",
        },
    },
    {
        id: 4,
        icon: Phone,
        title: {
            id: "Layanan 24/7",
            en: "24/7 Support",
        },
        description: {
            id: "Dukungan pelanggan kapan saja",
            en: "Customer support anytime",
        },
    },
];

const FeatureSection = () => {
    const { language } = useLanguage();

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
                                    {feature.title[language]}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description[language]}
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
