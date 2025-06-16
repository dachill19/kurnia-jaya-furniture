import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutPage = () => {
    return (
        <div className="container-custom py-8">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-kj-brown mb-4">
                    Tentang Kami
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Kurnia Jaya Furniture - Menyediakan furnitur berkualitas
                    dengan desain modern dan harga terjangkau sejak 2005.
                </p>
            </div>

            {/* Our Story Section */}
            <section className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-kj-brown mb-4">
                            Kisah Kami
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Kurnia Jaya Furniture didirikan pada tahun 2010
                            dengan visi sederhana yaitu menyediakan furniture
                            berkualitas tinggi dengan pelayanan terbaik untuk
                            semua orang. Produk yang kami jual dirancang dengan
                            perpaduan sempurna antara fungsionalitas, estetika,
                            dan kenyamanan. Kami memahami bahwa furniture bukan
                            sekedar tentang tampilan semata, tetapi juga
                            kualitas, kenyamanan, dan kepuasan yang bertahan
                            lama.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Kurnia Jaya Furniture selalu berkomitmen untuk
                            menyediakan produk terbaik dan memberikan pelayanan
                            pelanggan yang luar biasa. Kami percaya bahwa
                            kepuasan pelanggan adalah kunci keberhasilan Utama
                            dalam bisnis kami.
                        </p>
                        <p className="text-gray-600">
                            Di Kurnia Jaya, kami berkomitmen untuk menyediakan
                            produk terbaik dan layanan pelanggan yang luar
                            biasa. Kami percaya bahwa kepuasan pelanggan adalah
                            kunci keberhasilan kami.
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
                    Nilai-Nilai Kami
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-3 text-kj-red">
                            Kualitas
                        </h3>
                        <p className="text-gray-600">
                            Kami menggunakan material terbaik dan teknik
                            pembuatan yang cermat untuk memastikan produk kami
                            tahan lama dan memuaskan.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-3 text-kj-red">
                            Inovasi
                        </h3>
                        <p className="text-gray-600">
                            Kami terus mengembangkan desain baru dan mengadopsi
                            teknologi terbaru untuk menciptakan furnitur yang
                            modern dan fungsional.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-3 text-kj-red">
                            Pelayanan
                        </h3>
                        <p className="text-gray-600">
                            Kepuasan pelanggan adalah prioritas utama kami, dan
                            kami selalu berusaha memberikan pengalaman belanja
                            yang terbaik.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="mb-16">
                <h2 className="text-2xl font-serif font-bold text-kj-brown mb-6 text-center">
                    Hubungi Kami
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h3 className="font-serif font-bold text-xl mb-4 text-kj-brown">
                                Informasi Kontak
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <MapPin
                                        className="text-kj-red mt-1 mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>Alamat</strong>
                                        <br />
                                        JI. Raya Serang KM.15 No. 42-45,
                                        Talagasari, Kec. Cikupa, Kab. Tangerang,
                                        Banten, 15710
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Phone
                                        className="text-kj-red mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>Nomor Telepon</strong>
                                        <br />
                                        +62 822-9852-8428
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
                                        kurniajaya.furniture1688@gmail.com
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Clock
                                        className="text-kj-red mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                    <span>
                                        <strong>Jam Operasional:</strong>
                                        <br />
                                        Senin - Sabtu: 09:00 - 21:00, Minggu:
                                        10:00 - 20:00
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md h-full">
                            <h3 className="font-serif font-bold text-xl mb-4 text-kj-brown">
                                Lokasi Kami
                            </h3>
                            <div className="w-full h-64 bg-gray-200 rounded-md mb-4">
                                <a
                                    href="https://maps.app.goo.gl/8LF9Kmn8rjAU8R8Y8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                >
                                    <iframe
                                        title="Location Map"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.266869669652!2d106.51759217573148!3d-6.2285042609996575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e42074d1fcef9e7%3A0x2c99f055685aa943!2sYoeventius%20Kurnia%20Jaya!5e0!3m2!1sen!2sid!4v1750031109019!5m2!1sen!2sid"
                                        className="w-full h-full rounded-md"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{ border: 0 }}
                                    ></iframe>
                                </a>
                            </div>
                            <p className="text-gray-600">
                                Kami terletak di pusat Jakarta Selatan, mudah
                                diakses dengan transportasi umum dan tersedia
                                area parkir yang luas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Message from CEO */}
            <section className="text-center bg-gray-50 p-8 rounded-lg">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-serif font-bold text-kj-brown mb-4">
                        Pesan dari CEO
                    </h2>
                    <blockquote className="text-gray-600 italic mb-6">
                        "Di Kurnia Jaya Furniture, kami percaya bahwa rumah yang
                        indah dimulai dari furniture yang berkualitas. Komitmen
                        kami adalah untuk selalu menyediakan produk terbaik
                        dengan harga yang sesuai serta pelayanan terbaik untuk
                        semua pelanggan kami tanpa terkecuali. Ayo jadilah
                        bagian dari perjalanan kami"
                    </blockquote>
                    <p className="font-semibold text-kj-brown">
                        Frengky Cina, Pendiri & CEO
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
