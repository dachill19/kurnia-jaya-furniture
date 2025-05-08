import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutPage = () => {
    const { t, language } = useLanguage();

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

            {/* Our Values Section */}
            <section className="mb-16 bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-serif font-bold text-kj-brown mb-6 text-center">
                    {language === "id" ? "Nilai-Nilai Kami" : "Our Values"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-3 text-kj-red">
                            {language === "id" ? "Kualitas" : "Quality"}
                        </h3>
                        <p className="text-gray-600">
                            {language === "id"
                                ? "Kami menggunakan material terbaik dan teknik pembuatan yang cermat untuk memastikan produk kami tahan lama dan memuaskan."
                                : "We use the best materials and careful manufacturing techniques to ensure our products are durable and satisfying."}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-3 text-kj-red">
                            {language === "id" ? "Inovasi" : "Innovation"}
                        </h3>
                        <p className="text-gray-600">
                            {language === "id"
                                ? "Kami terus mengembangkan desain baru dan mengadopsi teknologi terbaru untuk menciptakan furnitur yang modern dan fungsional."
                                : "We continuously develop new designs and adopt the latest technologies to create modern and functional furniture."}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-3 text-kj-red">
                            {language === "id" ? "Pelayanan" : "Service"}
                        </h3>
                        <p className="text-gray-600">
                            {language === "id"
                                ? "Kepuasan pelanggan adalah prioritas utama kami, dan kami selalu berusaha memberikan pengalaman belanja yang terbaik."
                                : "Customer satisfaction is our top priority, and we always strive to provide the best shopping experience."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="mb-16">
                <h2 className="text-2xl font-serif font-bold text-kj-brown mb-6 text-center">
                    {language === "id" ? "Hubungi Kami" : "Contact Us"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h3 className="font-serif font-bold text-xl mb-4 text-kj-brown">
                                {language === "id"
                                    ? "Informasi Kontak"
                                    : "Contact Information"}
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <MapPin
                                        className="text-kj-red mt-1 mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>
                                            {language === "id"
                                                ? "Alamat:"
                                                : "Address:"}
                                        </strong>
                                        <br />
                                        Jl. Furniture No. 123, Jakarta Selatan,
                                        Indonesia
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Phone
                                        className="text-kj-red mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>
                                            {language === "id"
                                                ? "Telepon:"
                                                : "Phone:"}
                                        </strong>
                                        <br />
                                        +62 123 4567 890
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Mail
                                        className="text-kj-red mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>Email:</strong>
                                        <br />
                                        info@kurniajaya.com
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Clock
                                        className="text-kj-red mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>
                                            {language === "id"
                                                ? "Jam Operasional:"
                                                : "Operating Hours:"}
                                        </strong>
                                        <br />
                                        {language === "id"
                                            ? "Senin - Sabtu: 09:00 - 21:00, Minggu: 10:00 - 20:00"
                                            : "Monday - Saturday: 09:00 - 21:00, Sunday: 10:00 - 20:00"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md h-full">
                            <h3 className="font-serif font-bold text-xl mb-4 text-kj-brown">
                                {language === "id"
                                    ? "Lokasi Kami"
                                    : "Our Location"}
                            </h3>
                            <div className="w-full h-64 bg-gray-200 rounded-md mb-4">
                                <a
                                    href="https://maps.app.goo.gl/vq1j9ZcE7HLffR8u9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                >
                                    <iframe
                                        title="Location Map"
                                        src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1667.6075974079063!2d106.51787811180743!3d-6.229196467839362!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sid!4v1746668883552!5m2!1sen!2sid"
                                        className="w-full h-full rounded-md"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{ border: 0 }}
                                    ></iframe>
                                </a>
                            </div>
                            <p className="text-gray-600">
                                {language === "id"
                                    ? "Kami terletak di pusat Jakarta Selatan, mudah diakses dengan transportasi umum dan tersedia area parkir yang luas."
                                    : "We are located in the center of South Jakarta, easily accessible by public transportation, and ample parking is available."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Message from CEO */}
            <section className="text-center bg-gray-50 p-8 rounded-lg">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-serif font-bold text-kj-brown mb-4">
                        {language === "id"
                            ? "Pesan dari CEO"
                            : "Message from the CEO"}
                    </h2>
                    <blockquote className="text-gray-600 italic mb-6">
                        {language === "id"
                            ? '"Di Kurnia Jaya Furniture, kami percaya bahwa rumah yang indah dimulai dari furnitur yang berkualitas. Komitmen kami adalah menyediakan produk terbaik dengan harga yang terjangkau untuk semua pelanggan kami. Terima kasih telah menjadi bagian dari perjalanan kami."'
                            : '"At Kurnia Jaya Furniture, we believe that a beautiful home starts with quality furniture. Our commitment is to provide the best products at affordable prices for all our customers. Thank you for being part of our journey."'}
                    </blockquote>
                    <p className="font-semibold text-kj-brown">
                        {language === "id"
                            ? "Ahmad Kurnia, Pendiri & CEO"
                            : "Ahmad Kurnia, Founder & CEO"}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
