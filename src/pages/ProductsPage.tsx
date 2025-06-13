import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/stores/productStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { Search, Sliders, X, ChevronLeft, ChevronRight } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductsPageSkeleton } from "@/components/skeleton/ProductsPageSkeleton";

const ProductsPage = () => {
    // Search and basic filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [sortOrder, setSortOrder] = useState("featured");
    const [filterVisible, setFilterVisible] = useState(false);

    // Advanced filters
    const [stockFilter, setStockFilter] = useState("all");
    const [discountFilter, setDiscountFilter] = useState(false);
    const [hotProductsFilter, setHotProductsFilter] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    // Zustand stores
    const {
        categories,
        products,
        error,
        getCategories,
        getAllProducts,
        getProductsByCategory,
        clearError,
    } = useProductStore();

    const { isLoadingKey } = useLoadingStore();

    // Load initial data
    useEffect(() => {
        getCategories();
        getAllProducts();
    }, [getCategories, getAllProducts]);

    // Handle category filter change
    useEffect(() => {
        if (categoryFilter === "all") {
            getAllProducts();
        } else {
            getProductsByCategory(categoryFilter);
        }
    }, [categoryFilter, getProductsByCategory, getAllProducts]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchQuery,
        categoryFilter,
        priceRange,
        sortOrder,
        stockFilter,
        discountFilter,
        hotProductsFilter,
    ]);

    // Prepare categories for filter
    const filterCategories = [
        { id: "all", name: "Semua Kategori" },
        ...categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
        })),
    ];

    // Transform product data to match ProductCard props structure
    const transformProduct = (product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discount_price,
        images:
            product.product_image?.map((img) => ({
                imageUrl: img.image_url,
                isMain: img.is_main,
            })) || [],
        reviews: product.reviews || [],
        category: {
            name: product.category?.name || "Unknown Category",
        },
        isHot: product.is_hot || false,
        stock: product.stock || 0,
        inStock: product.stock > 0,
    });

    // Calculate average rating for products
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        return totalRating / reviews.length;
    };

    // Filter and sort products
    const filteredProducts = products
        .filter((product) => {
            // Search filter
            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            // Price filter
            const productPrice = product.discount_price || product.price;
            const priceMatch =
                productPrice >= priceRange[0] && productPrice <= priceRange[1];

            // Stock filter
            let stockMatch = true;
            if (stockFilter === "inStock") {
                stockMatch = product.stock > 0;
            } else if (stockFilter === "outOfStock") {
                stockMatch = product.stock === 0;
            }

            // Discount filter
            const discountMatch =
                !discountFilter || product.discount_price !== null;

            // Hot products filter
            const hotMatch = !hotProductsFilter || product.is_hot;

            return (
                searchMatch &&
                priceMatch &&
                stockMatch &&
                discountMatch &&
                hotMatch
            );
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case "priceAsc":
                    const priceA = a.discount_price || a.price;
                    const priceB = b.discount_price || b.price;
                    return priceA - priceB;
                case "priceDesc":
                    const priceA2 = a.discount_price || a.price;
                    const priceB2 = b.discount_price || b.price;
                    return priceB2 - priceA2;
                case "nameAsc":
                    return a.name.localeCompare(b.name);
                case "nameDesc":
                    return b.name.localeCompare(a.name);
                case "rating":
                    const ratingA = calculateAverageRating(a.reviews);
                    const ratingB = calculateAverageRating(b.reviews);
                    return ratingB - ratingA;
                case "newest":
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    );
                case "stock":
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

    // Pagination calculations
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Pagination helpers
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    // Event handlers
    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const toggleFilters = () => {
        setFilterVisible(!filterVisible);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all");
        setPriceRange([0, 10000000]);
        setSortOrder("featured");
        setStockFilter("all");
        setDiscountFilter(false);
        setHotProductsFilter(false);
        setCurrentPage(1);
    };

    // Get active filter count for badge
    const getActiveFilterCount = () => {
        let count = 0;
        if (categoryFilter !== "all") count++;
        if (priceRange[0] !== 0 || priceRange[1] !== 10000000) count++;
        if (stockFilter !== "all") count++;
        if (discountFilter) count++;
        if (hotProductsFilter) count++;
        return count;
    };

    // Loading state
    if (
        isLoadingKey("categories") ||
        isLoadingKey("products-by-category") ||
        isLoadingKey("all-products")
    ) {
        return <ProductsPageSkeleton />;
    }

    // Error state
    if (error) {
        return (
            <div className="container-custom py-8">
                <div className="text-center py-16">
                    <h3 className="text-xl font-medium mb-2 text-red-600">
                        Terjadi Kesalahan
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button
                        onClick={() => {
                            clearError();
                            getCategories();
                            getAllProducts();
                        }}
                        className="bg-kj-red hover:bg-kj-darkred"
                    >
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="section-title text-2xl md:text-4xl mb-8">Produk</h1>

            {/* Search and filter controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
                {/* Search bar */}
                <div className="relative w-full lg:w-1/2">
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kj-red focus:border-transparent"
                    />
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        >
                            <X size={16} />
                        </Button>
                    )}
                </div>

                {/* Desktop controls */}
                <div className="hidden lg:flex items-center gap-4">
                    <Select
                        value={sortOrder}
                        onValueChange={(value) => setSortOrder(value)}
                    >
                        <SelectTrigger className="min-w-[200px]">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="featured">Unggulan</SelectItem>
                            <SelectItem value="priceAsc">
                                Harga Terendah
                            </SelectItem>
                            <SelectItem value="priceDesc">
                                Harga Tertinggi
                            </SelectItem>
                            <SelectItem value="nameAsc">Nama A-Z</SelectItem>
                            <SelectItem value="nameDesc">Nama Z-A</SelectItem>
                            <SelectItem value="rating">
                                Rating Tertinggi
                            </SelectItem>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="stock">
                                Stok Terbanyak
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={toggleFilters}
                        className="flex items-center gap-2 relative"
                    >
                        <Sliders size={18} />
                        Filter
                        {getActiveFilterCount() > 0 && (
                            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-kj-red text-white">
                                {getActiveFilterCount()}
                            </Badge>
                        )}
                    </Button>
                </div>

                {/* Mobile controls */}
                <div className="flex lg:hidden w-full gap-4">
                    <Select
                        value={sortOrder}
                        onValueChange={(value) => setSortOrder(value)}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="featured">Unggulan</SelectItem>
                            <SelectItem value="priceAsc">
                                Harga Terendah
                            </SelectItem>
                            <SelectItem value="priceDesc">
                                Harga Tertinggi
                            </SelectItem>
                            <SelectItem value="nameAsc">Nama A-Z</SelectItem>
                            <SelectItem value="nameDesc">Nama Z-A</SelectItem>
                            <SelectItem value="rating">
                                Rating Tertinggi
                            </SelectItem>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="stock">
                                Stok Terbanyak
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={toggleFilters}
                        className="flex items-center gap-2 relative"
                    >
                        <Sliders size={18} />
                        Filter
                        {getActiveFilterCount() > 0 && (
                            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-kj-red text-white">
                                {getActiveFilterCount()}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>

            {/* Active filters display */}
            {getActiveFilterCount() > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-600">
                            Filter aktif:
                        </span>

                        {categoryFilter !== "all" && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                Kategori:{" "}
                                {
                                    filterCategories.find(
                                        (c) => c.id === categoryFilter
                                    )?.name
                                }
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCategoryFilter("all")}
                                    className="h-4 w-4 p-0 ml-1"
                                >
                                    <X size={12} />
                                </Button>
                            </Badge>
                        )}

                        {(priceRange[0] !== 0 ||
                            priceRange[1] !== 10000000) && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                Harga: Rp {priceRange[0].toLocaleString()} - Rp{" "}
                                {priceRange[1].toLocaleString()}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPriceRange([0, 10000000])}
                                    className="h-4 w-4 p-0 ml-1"
                                >
                                    <X size={12} />
                                </Button>
                            </Badge>
                        )}

                        {stockFilter !== "all" && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {stockFilter === "inStock"
                                    ? "Tersedia"
                                    : "Habis"}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setStockFilter("all")}
                                    className="h-4 w-4 p-0 ml-1"
                                >
                                    <X size={12} />
                                </Button>
                            </Badge>
                        )}

                        {discountFilter && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                Sedang Diskon
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDiscountFilter(false)}
                                    className="h-4 w-4 p-0 ml-1"
                                >
                                    <X size={12} />
                                </Button>
                            </Badge>
                        )}

                        {hotProductsFilter && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                Produk Hot
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setHotProductsFilter(false)}
                                    className="h-4 w-4 p-0 ml-1"
                                >
                                    <X size={12} />
                                </Button>
                            </Badge>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="text-kj-red"
                        >
                            Hapus Semua
                        </Button>
                    </div>
                </div>
            )}

            {/* Filter panel */}
            {filterVisible && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-medium text-lg">Filter Produk</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFilters}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Categories */}
                        <div>
                            <h3 className="font-medium mb-3">Kategori</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {filterCategories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={
                                            categoryFilter === category.id
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setCategoryFilter(category.id)
                                        }
                                        className={`w-full justify-start text-sm ${
                                            categoryFilter === category.id
                                                ? "hover:bg-kj-darkred"
                                                : "hover:border-kj-red"
                                        }`}
                                        size="sm"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-medium mb-3">Rentang Harga</h3>
                            <div className="px-2">
                                <Slider
                                    defaultValue={[0, 10000000]}
                                    max={10000000}
                                    step={100000}
                                    value={priceRange}
                                    onValueChange={handlePriceChange}
                                    className="mb-4"
                                />
                                <div className="flex justify-between text-sm">
                                    <span>
                                        Rp {priceRange[0].toLocaleString()}
                                    </span>
                                    <span>
                                        Rp {priceRange[1].toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stock & Availability */}
                        <div>
                            <h3 className="font-medium mb-3">Ketersediaan</h3>
                            <div className="space-y-2">
                                {[
                                    { value: "all", label: "Semua" },
                                    { value: "inStock", label: "Tersedia" },
                                    { value: "outOfStock", label: "Habis" },
                                ].map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={
                                            stockFilter === option.value
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setStockFilter(option.value)
                                        }
                                        className={`w-full justify-start text-sm ${
                                            stockFilter === option.value
                                                ? "hover:bg-kj-darkred"
                                                : "hover:border-kj-red"
                                        }`}
                                        size="sm"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Special Filters */}
                        <div>
                            <h3 className="font-medium mb-3">Filter Khusus</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="discount"
                                        type="checkbox"
                                        checked={discountFilter}
                                        onChange={(e) =>
                                            setDiscountFilter(e.target.checked)
                                        }
                                        className="rounded border-gray-300 text-kj-red focus:ring-kj-red"
                                    />
                                    <label
                                        htmlFor="discount"
                                        className="text-sm"
                                    >
                                        Sedang Diskon
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="hot"
                                        type="checkbox"
                                        checked={hotProductsFilter}
                                        onChange={(e) =>
                                            setHotProductsFilter(
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-gray-300 text-kj-red focus:ring-kj-red"
                                    />
                                    <label htmlFor="hot" className="text-sm">
                                        Produk Hot
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                        <Button variant="outline" onClick={handleClearFilters}>
                            Bersihkan Semua
                        </Button>
                        <Button
                            onClick={toggleFilters}
                            className="bg-kj-red hover:bg-kj-darkred"
                        >
                            Terapkan Filter
                        </Button>
                    </div>
                </div>
            )}

            {/* Results stats */}
            <div className="mb-6">
                <p className="text-gray-600">
                    Menampilkan {startIndex + 1}-
                    {Math.min(endIndex, totalProducts)} dari {totalProducts}{" "}
                    produk
                    {searchQuery && (
                        <span className="ml-1">untuk "{searchQuery}"</span>
                    )}
                    {totalPages > 1 && (
                        <span className="ml-1">
                            (Halaman {currentPage} dari {totalPages})
                        </span>
                    )}
                </p>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProducts.map((product) => {
                    const transformedProduct = transformProduct(product);
                    return (
                        <ProductCard
                            key={transformedProduct.id}
                            {...transformedProduct}
                        />
                    );
                })}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <h3 className="text-xl font-medium mb-2">
                        Produk tidak ditemukan
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery
                            ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                            : "Coba ubah filter pencarian Anda"}
                    </p>
                    <Button
                        onClick={handleClearFilters}
                        className="bg-kj-red hover:bg-kj-darkred"
                    >
                        Bersihkan Filter
                    </Button>
                </div>
            )}

            {/* Functional Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
                    {/* Pagination Info */}
                    <div className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-1">
                        {/* Previous Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft size={16} />
                            Sebelumnya
                        </Button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex items-center space-x-1">
                            {getPageNumbers().map((pageNumber, index) => (
                                <div key={index}>
                                    {pageNumber === "..." ? (
                                        <span className="px-3 py-1 text-gray-500">
                                            ...
                                        </span>
                                    ) : (
                                        <Button
                                            variant={
                                                currentPage === pageNumber
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() => goToPage(pageNumber)}
                                            className={`min-w-[40px] ${
                                                currentPage === pageNumber
                                                    ? "bg-kj-red text-white hover:bg-kj-darkred"
                                                    : "hover:border-kj-red"
                                            }`}
                                        >
                                            {pageNumber}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile: Show only current page */}
                        <div className="sm:hidden">
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-kj-red text-white hover:bg-kj-darkred min-w-[40px]"
                            >
                                {currentPage}
                            </Button>
                        </div>

                        {/* Next Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1"
                        >
                            Selanjutnya
                            <ChevronRight size={16} />
                        </Button>
                    </div>

                    {/* Jump to Page (Desktop only) */}
                    <div className="hidden lg:flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Ke halaman:
                        </span>
                        <Select
                            value={currentPage.toString()}
                            onValueChange={(value) => goToPage(parseInt(value))}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <SelectItem
                                        key={page}
                                        value={page.toString()}
                                    >
                                        {page}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
