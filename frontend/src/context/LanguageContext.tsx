import React, { createContext, useContext, useState, ReactNode } from "react";

// Language types
type Language = "en" | "id";

// English translations
const enTranslations = {
    // Navigation
    navHome: "Home",
    navCategories: "Categories",
    navProducts: "Products",
    navAbout: "About Us",
    navCart: "Cart",

    // Auth
    signIn: "Sign In",
    register: "Register",
    logOut: "Log Out",

    // Search
    searchPlaceholder: "Search for furniture...",
    search: "Search",

    // Categories
    categories: "Categories",
    shopByCategory: "Shop by Category",
    allCategories: "All Categories",
    sofa: "Sofa",
    bed: "Bed",
    wardrobe: "Wardrobe",
    diningTable: "Dining Table",
    displayCabinet: "Display Cabinet",
    buffet: "Buffet",
    officeTable: "Office Table",
    chair: "Chair",
    bookshelf: "Bookshelf",
    coffeeTable: "Coffee Table",

    // Products
    products: "Products",
    hotProducts: "Hot Products",
    newArrivals: "New Arrivals",
    viewAll: "View All",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    filterProducts: "Filter Products",
    sortBy: "Sort By",
    priceRange: "Price Range",
    featured: "Featured",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    nameAZ: "Name: A-Z",
    nameZA: "Name: Z-A",
    topRated: "Top Rated",
    filter: "Filter",
    otherFilters: "Other Filters",
    material: "Material",
    wood: "Wood",
    metal: "Metal",
    fabric: "Fabric",
    clearAll: "Clear All",
    applyFilters: "Apply Filters",
    showing: "Showing",
    of: "of",
    noProductsFound: "No products found",
    tryDifferentFilters: "Try different filters or search terms",
    clearFilters: "Clear Filters",
    previous: "Previous",
    next: "Next",

    // Cart
    cart: "Shopping Cart",
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    continueToCheckout: "Continue to Checkout",
    subtotal: "Subtotal",
    tax: "Tax",
    shipping: "Shipping",
    total: "Total",
    removeItem: "Remove Item",

    // Hero
    heroTitle1: "New Furniture Collection",
    heroSubtitle1: "Modern Design & High Quality",
    heroCta1: "Shop Now",
    heroTitle2: "Up to 30% Off",
    heroSubtitle2: "For All Living Room Furniture",
    heroCta2: "View Offers",
    heroTitle3: "Kurnia Jaya Furniture",
    heroSubtitle3: "#1 Best Furniture in Town",
    heroCta3: "About Us",

    // About Page
    aboutTitle: "About Us",
    aboutDescription:
        "Kurnia Jaya Furniture - Providing quality furniture with modern design and affordable prices since 2005.",
    aboutStoryTitle: "Our Story",
    aboutStoryParagraph1:
        "Kurnia Jaya Furniture was established in 2005 with a simple vision: to provide high-quality furniture at affordable prices for everyone. We started from a small shop in Jakarta and have now grown to become one of the leading furniture companies in Indonesia.",
    aboutStoryParagraph2:
        "Our products are designed with the perfect blend of functionality, aesthetics, and comfort. We understand that furniture is not just about appearance, but also about lasting quality and comfort.",
    aboutStoryParagraph3:
        "At Kurnia Jaya, we are committed to providing the best products and exceptional customer service. We believe that customer satisfaction is the key to our success.",
    ourValueTitle: "Our Values",
    value1: "Quality",
    valueDescription1:
        "We use the best materials and careful manufacturing techniques to ensure our products are durable and satisfying.",
    value2: "Innovation",
    valueDescription2:
        "We continuously develop new designs and adopt the latest technologies to create modern and functional furniture.",
    value3: "Service",
    valueDescription3:
        "Customer satisfaction is our top priority, and we always strive to provide the best shopping experience.",

    // Contact Information
    contactInformation: "Contact Information",
    address: "Address",
    phone: "Phone",

    // Footer
    customerService: "Customer Service",
    aboutUs: "About Us",
    trackOrder: "Track Order",
    payment: "Payment",
    contactUs: "Contact Us",
};

// Indonesian translations
const idTranslations = {
    // Navigation
    navHome: "Beranda",
    navCategories: "Kategori",
    navProducts: "Produk",
    navAbout: "Tentang Kami",
    navCart: "Keranjang",

    // Auth
    signIn: "Masuk",
    register: "Daftar",
    logOut: "Keluar",

    // Search
    searchPlaceholder: "Cari furnitur...",
    search: "Cari",

    // Categories
    categories: "Kategori",
    shopByCategory: "Belanja berdasarkan Kategori",
    allCategories: "Semua Kategori",
    sofa: "Sofa",
    bed: "Tempat Tidur",
    wardrobe: "Lemari Pakaian",
    diningTable: "Meja Makan",
    displayCabinet: "Lemari Pajangan",
    buffet: "Bufet",
    officeTable: "Meja Kantor",
    chair: "Kursi",
    bookshelf: "Rak Buku",
    coffeeTable: "Meja Kopi",

    // Products
    products: "Produk",
    hotProducts: "Produk Populer",
    newArrivals: "Produk Terbaru",
    viewAll: "Lihat Semua",
    addToCart: "Tambah ke Keranjang",
    buyNow: "Beli Sekarang",
    outOfStock: "Stok Habis",
    inStock: "Tersedia",
    filterProducts: "Filter Produk",
    sortBy: "Urutkan",
    priceRange: "Rentang Harga",
    featured: "Unggulan",
    priceLowToHigh: "Harga: Rendah ke Tinggi",
    priceHighToLow: "Harga: Tinggi ke Rendah",
    nameAZ: "Nama: A-Z",
    nameZA: "Nama: Z-A",
    topRated: "Penilaian Tertinggi",
    filter: "Filter",
    otherFilters: "Filter Lainnya",
    material: "Bahan",
    wood: "Kayu",
    metal: "Logam",
    fabric: "Kain",
    clearAll: "Hapus Semua",
    applyFilters: "Terapkan Filter",
    showing: "Menampilkan",
    of: "dari",
    noProductsFound: "Tidak ada produk ditemukan",
    tryDifferentFilters: "Coba filter atau kata kunci pencarian lainnya",
    clearFilters: "Hapus Filter",
    previous: "Sebelumnya",
    next: "Selanjutnya",

    // Cart
    cart: "Keranjang Belanja",
    emptyCart: "Keranjang Anda kosong",
    startShopping: "Mulai Belanja",
    continueToCheckout: "Lanjutkan ke Pembayaran",
    subtotal: "Subtotal",
    tax: "Pajak",
    shipping: "Pengiriman",
    total: "Total",
    removeItem: "Hapus Item",

    // Hero
    heroTitle1: "Koleksi Furniture Terbaru",
    heroSubtitle1: "Desain Modern & Berkualitas Tinggi",
    heroCta1: "Belanja Sekarang",
    heroTitle2: "Diskon Hingga 30%",
    heroSubtitle2: "Untuk Semua Furnitur Ruang Tamu",
    heroCta2: "Lihat Penawaran",
    heroTitle3: "Kurnia Jaya Furniture",
    heroSubtitle3: "#1 Furniture Terbaik di Kota#1 Furniture Terbaik di Kota",
    heroCta3: "Tentang Kami",

    // About Page
    aboutTitle: "Tentang Kami",
    aboutDescription:
        "Kurnia Jaya Furniture - Menyediakan furnitur berkualitas dengan desain modern dan harga terjangkau sejak 2005.",
    aboutStoryTitle: "Kisah Kami",
    aboutStoryParagraph1:
        "Kurnia Jaya Furniture didirikan pada tahun 2005 dengan visi sederhana: menyediakan furnitur berkualitas tinggi dengan harga terjangkau untuk semua orang. Kami memulai dari toko kecil di Jakarta dan kini telah berkembang menjadi salah satu perusahaan furnitur terkemuka di Indonesia.",
    aboutStoryParagraph2:
        "Produk kami dirancang dengan perpaduan sempurna antara fungsionalitas, estetika, dan kenyamanan. Kami memahami bahwa furnitur bukan hanya tentang tampilan, tetapi juga tentang kualitas dan kenyamanan yang bertahan lama.",
    aboutStoryParagraph3:
        "Di Kurnia Jaya, kami berkomitmen untuk menyediakan produk terbaik dan layanan pelanggan yang luar biasa. Kami percaya bahwa kepuasan pelanggan adalah kunci keberhasilan kami.",
    ourValueTitle: "Nilai-Nilai Kami",
    value1: "Kualitas",
    valueDescription1:
        "Kami menggunakan material terbaik dan teknik pembuatan yang cermat untuk memastikan produk kami tahan lama dan memuaskan.",
    value2: "Inovasi",
    valueDescription2:
        "Kami terus mengembangkan desain baru dan mengadopsi teknologi terbaru untuk menciptakan furnitur yang modern dan fungsional.",
    value3: "Pelayanan",
    valueDescription3:
        "Kepuasan pelanggan adalah prioritas utama kami, dan kami selalu berusaha memberikan pengalaman belanja yang terbaik.",

    // Contact Information
    contactInformation: "Informasi Kontak",
    address: "Alamat",
    phone: "Telepon",

    // Footer
    customerService: "Layanan Pelanggan",
    aboutUs: "Tentang Kami",
    trackOrder: "Lacak Pesanan",
    payment: "Pembayaran",
    contactUs: "Hubungi Kami",
};

// Translations type
type Translations = typeof enTranslations;

// Context type
interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof Translations) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState<Language>(() => {
        // Try to get saved language preference
        const savedLanguage = localStorage.getItem("language");
        return savedLanguage === "id" || savedLanguage === "en"
            ? savedLanguage
            : "en";
    });

    // Update localStorage when language changes
    React.useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    // Translate function
    const t = (key: keyof Translations): string => {
        const translations =
            language === "en" ? enTranslations : idTranslations;
        return translations[key] || key;
    };

    const value = {
        language,
        setLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook for using the language context
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
