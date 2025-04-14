import React, { createContext, useContext, useState, ReactNode } from 'react';

// Language types
type Language = 'en' | 'id';

// English translations
const enTranslations = {
    // Navigation
    navHome: 'Home',
    navCategories: 'Categories',
    navProducts: 'Products',
    navAbout: 'About Us',
    navCart: 'Cart',

    // Auth
    signIn: 'Sign In',
    register: 'Register',
    logOut: 'Log Out',

    // Search
    searchPlaceholder: 'Search for furniture...',
    search: 'Search',

    // Categories
    categories: 'Categories',
    shopByCategory: 'Shop by Category',
    allCategories: 'All Categories',
    sofa: 'Sofa',
    bed: 'Bed',
    wardrobe: 'Wardrobe',
    diningTable: 'Dining Table',
    displayCabinet: 'Display Cabinet',
    buffet: 'Buffet',
    officeTable: 'Office Table',
    chair: 'Chair',
    bookshelf: 'Bookshelf',
    coffeeTable: 'Coffee Table',

    // Products
    products: 'Products',
    hotProducts: 'Hot Products',
    newArrivals: 'New Arrivals',
    viewAll: 'View All',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    filterProducts: 'Filter Products',
    sortBy: 'Sort By',
    priceRange: 'Price Range',
    featured: 'Featured',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    nameAZ: 'Name: A-Z',
    nameZA: 'Name: Z-A',
    topRated: 'Top Rated',
    filter: 'Filter',
    otherFilters: 'Other Filters',
    material: 'Material',
    wood: 'Wood',
    metal: 'Metal',
    fabric: 'Fabric',
    clearAll: 'Clear All',
    applyFilters: 'Apply Filters',
    showing: 'Showing',
    of: 'of',
    noProductsFound: 'No products found',
    tryDifferentFilters: 'Try different filters or search terms',
    clearFilters: 'Clear Filters',
    previous: 'Previous',
    next: 'Next',

    // Product Details
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    dimensions: 'Dimensions',
    weight: 'Weight',
    color: 'Color',
    relatedProducts: 'Related Products',
    writeReview: 'Write a Review',

    // Auth Pages
    createAccount: 'Create Account',
    email: 'Email Address',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    orContinueWith: 'Or continue with',
    agreeToTerms: 'I agree to the',
    termsAndConditions: 'Terms and Conditions',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    usePhoneInstead: 'Use phone number instead',
    useEmailInstead: 'Use email instead',
    fullName: 'Full Name',

    // Cart
    cart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    startShopping: 'Start Shopping',
    continueToCheckout: 'Continue to Checkout',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    total: 'Total',
    removeItem: 'Remove Item',

    // Checkout
    checkout: 'Checkout',
    shippingAddress: 'Shipping Address',
    billingAddress: 'Billing Address',
    sameAsShipping: 'Same as shipping address',
    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',

    // Footer
    customerService: 'Customer Service',
    aboutUs: 'About Us',
    trackOrder: 'Track Order',
    payment: 'Payment',
    contactUs: 'Contact Us',

    // Benefits Section
    whyChooseUs: 'Why Choose Us',
    qualityProducts: 'Quality Products',
    qualityProductsDesc: 'Our furniture is made from the highest quality materials',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'We deliver your orders within 3-7 business days',
    warranty: 'Warranty',
    warrantyDesc: 'All our products come with a 1-year warranty',
    support: '24/7 Support',
    supportDesc: 'Our customer support team is always ready to help'
};

// Indonesian translations
const idTranslations = {
    // Navigation
    navHome: 'Beranda',
    navCategories: 'Kategori',
    navProducts: 'Produk',
    navAbout: 'Tentang Kami',
    navCart: 'Keranjang',

    // Auth
    signIn: 'Masuk',
    register: 'Daftar',
    logOut: 'Keluar',

    // Search
    searchPlaceholder: 'Cari furnitur...',
    search: 'Cari',

    // Categories
    categories: 'Kategori',
    shopByCategory: 'Belanja berdasarkan Kategori',
    allCategories: 'Semua Kategori',
    sofa: 'Sofa',
    bed: 'Tempat Tidur',
    wardrobe: 'Lemari Pakaian',
    diningTable: 'Meja Makan',
    displayCabinet: 'Lemari Pajangan',
    buffet: 'Bufet',
    officeTable: 'Meja Kantor',
    chair: 'Kursi',
    bookshelf: 'Rak Buku',
    coffeeTable: 'Meja Kopi',

    // Products
    products: 'Produk',
    hotProducts: 'Produk Populer',
    newArrivals: 'Produk Terbaru',
    viewAll: 'Lihat Semua',
    addToCart: 'Tambah ke Keranjang',
    buyNow: 'Beli Sekarang',
    outOfStock: 'Stok Habis',
    inStock: 'Tersedia',
    filterProducts: 'Filter Produk',
    sortBy: 'Urutkan',
    priceRange: 'Rentang Harga',
    featured: 'Unggulan',
    priceLowToHigh: 'Harga: Rendah ke Tinggi',
    priceHighToLow: 'Harga: Tinggi ke Rendah',
    nameAZ: 'Nama: A-Z',
    nameZA: 'Nama: Z-A',
    topRated: 'Penilaian Tertinggi',
    filter: 'Filter',
    otherFilters: 'Filter Lainnya',
    material: 'Bahan',
    wood: 'Kayu',
    metal: 'Logam',
    fabric: 'Kain',
    clearAll: 'Hapus Semua',
    applyFilters: 'Terapkan Filter',
    showing: 'Menampilkan',
    of: 'dari',
    noProductsFound: 'Tidak ada produk ditemukan',
    tryDifferentFilters: 'Coba filter atau kata kunci pencarian lainnya',
    clearFilters: 'Hapus Filter',
    previous: 'Sebelumnya',
    next: 'Selanjutnya',

    // Product Details
    description: 'Deskripsi',
    specifications: 'Spesifikasi',
    reviews: 'Ulasan',
    dimensions: 'Dimensi',
    weight: 'Berat',
    color: 'Warna',
    relatedProducts: 'Produk Terkait',
    writeReview: 'Tulis Ulasan',

    // Auth Pages
    createAccount: 'Buat Akun',
    email: 'Alamat Email',
    phone: 'Nomor Telepon',
    password: 'Kata Sandi',
    confirmPassword: 'Konfirmasi Kata Sandi',
    rememberMe: 'Ingat Saya',
    forgotPassword: 'Lupa Kata Sandi?',
    orContinueWith: 'Atau lanjutkan dengan',
    agreeToTerms: 'Saya menyetujui',
    termsAndConditions: 'Syarat dan Ketentuan',
    alreadyHaveAccount: 'Sudah punya akun?',
    dontHaveAccount: 'Belum punya akun?',
    usePhoneInstead: 'Gunakan nomor telepon',
    useEmailInstead: 'Gunakan email',
    fullName: 'Nama Lengkap',

    // Cart
    cart: 'Keranjang Belanja',
    emptyCart: 'Keranjang Anda kosong',
    startShopping: 'Mulai Belanja',
    continueToCheckout: 'Lanjutkan ke Pembayaran',
    subtotal: 'Subtotal',
    tax: 'Pajak',
    shipping: 'Pengiriman',
    total: 'Total',
    removeItem: 'Hapus Item',

    // Checkout
    checkout: 'Pembayaran',
    shippingAddress: 'Alamat Pengiriman',
    billingAddress: 'Alamat Penagihan',
    sameAsShipping: 'Sama dengan alamat pengiriman',
    paymentMethod: 'Metode Pembayaran',
    orderSummary: 'Ringkasan Pesanan',
    placeOrder: 'Buat Pesanan',

    // Footer
    customerService: 'Layanan Pelanggan',
    aboutUs: 'Tentang Kami',
    trackOrder: 'Lacak Pesanan',
    payment: 'Pembayaran',
    contactUs: 'Hubungi Kami',

    // Benefits Section
    whyChooseUs: 'Mengapa Memilih Kami',
    qualityProducts: 'Produk Berkualitas',
    qualityProductsDesc: 'Furnitur kami terbuat dari bahan berkualitas tinggi',
    fastDelivery: 'Pengiriman Cepat',
    fastDeliveryDesc: 'Kami mengirimkan pesanan Anda dalam 3-7 hari kerja',
    warranty: 'Garansi',
    warrantyDesc: 'Semua produk kami memiliki garansi 1 tahun',
    support: 'Dukungan 24/7',
    supportDesc: 'Tim dukungan pelanggan kami selalu siap membantu'
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
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        // Try to get saved language preference
        const savedLanguage = localStorage.getItem('language');
        return (savedLanguage === 'id' || savedLanguage === 'en') ? savedLanguage : 'en';
    });

    // Update localStorage when language changes
    React.useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Translate function
    const t = (key: keyof Translations): string => {
        const translations = language === 'en' ? enTranslations : idTranslations;
        return translations[key] || key;
    };

    const value = {
        language,
        setLanguage,
        t
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
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};