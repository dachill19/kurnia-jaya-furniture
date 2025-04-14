import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutPage = () => {
    const { t } = useLanguage();

    return (
        <div className="container-custom py-12">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-kj-brown mb-4">
                    {t("aboutTitle")}
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {t("aboutDescription")}
                </p>
            </div>
            {/* Our Story Section */}
            <section className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-kj-brown mb-4">
                            {t("aboutStoryTitle")}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {t("aboutStoryParagraph1")}
                        </p>
                        <p className="text-gray-600 mb-4">
                            {t("aboutStoryParagraph2")}
                        </p>
                        <p className="text-gray-600">
                            {t("aboutStoryParagraph3")}
                        </p>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=2070&auto=format&fit=crop"
                            alt="Our Workshop"
                            className="rounded-lg shadow-lg w-full h-auto"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
