import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
    const slidesData = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
            title: "Koleksi Furniture Terbaru",
            subtitle: "Desain Modern & Berkualitas Tinggi",
            cta: "Belanja Sekarang",
            link: "/products",
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
            title: "Diskon Hingga 30%",
            subtitle: "Untuk Furnitur Tertentu",
            cta: "Lihat Penawaran",
            link: "/products",
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop",
            title: "Kurnia Jaya Furniture",
            subtitle: "#1 Furniture Terbaik di Kota",
            cta: "Tentang Kami",
            link: "/about",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) =>
            prev === slidesData.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? slidesData.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            {/* Slides */}
            {slidesData.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 max-w-2xl">
                            {slide.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-6 max-w-xl">
                            {slide.subtitle}
                        </p>
                        <Button
                            asChild
                            className="bg-kj-red hover:bg-kj-darkred text-white px-6 py-2 rounded-md"
                        >
                            <Link to={slide.link}>{slide.cta}</Link>
                        </Button>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                onClick={prevSlide}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                onClick={nextSlide}
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slidesData.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentSlide ? "bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Hero;
