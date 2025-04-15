import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
        title: {
            id: "Koleksi Furniture Terbaru",
            en: "New Furniture Collection",
        },
        subtitle: {
            id: "Desain Modern & Berkualitas Tinggi",
            en: "Modern Design & High Quality",
        },
        cta: {
            id: "Belanja Sekarang",
            en: "Shop Now",
        },
        link: "/products",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
        title: {
            id: "Diskon Hingga 30%",
            en: "Up to 30% Off",
        },
        subtitle: {
            id: "Untuk Semua Furnitur Ruang Tamu",
            en: "For All Living Room Furniture",
        },
        cta: {
            id: "Lihat Penawaran",
            en: "View Offers",
        },
        link: "/categories/living-room",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop",
        title: {
            id: "Kurnia Jaya Furniture",
            en: "Kurnia Jaya Furniture",
        },
        subtitle: {
            id: "#1 Furniture Terbaik di Kota",
            en: "#1 Best Furniture in Town",
        },
        cta: {
            id: "Tentang Kami",
            en: "About Us",
        },
        link: "/about",
    },
];
