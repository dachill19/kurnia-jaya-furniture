import { ProductGridSkeleton } from "./ProductGridSkeleton";

export const ProductsPageSkeleton = () => {
    return (
        <div className="container-custom py-8">
            {/* Page Title Skeleton */}
            <div className="h-8 md:h-12 bg-gray-200 animate-pulse rounded mb-8 w-32"></div>

            {/* Search and Filter Controls Skeleton */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
                {/* Search Bar Skeleton */}
                <div className="relative w-full lg:w-1/2">
                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>

                {/* Desktop Controls Skeleton */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>

                {/* Mobile Controls Skeleton */}
                <div className="flex lg:hidden w-full gap-4">
                    <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>

            {/* Results Stats Skeleton */}
            <div className="mb-6">
                <div className="h-5 w-80 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Products Grid Skeleton */}
            <ProductGridSkeleton count={20} />

            {/* Pagination Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
                {/* Pagination Info Skeleton */}
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>

                {/* Pagination Controls Skeleton */}
                <div className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>

                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="h-8 w-10 bg-gray-200 animate-pulse rounded"
                            ></div>
                        ))}
                    </div>

                    {/* Mobile: Current page */}
                    <div className="sm:hidden">
                        <div className="h-8 w-10 bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    {/* Next Button */}
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>

                {/* Jump to Page Skeleton (Desktop only) */}
                <div className="hidden lg:flex items-center gap-2">
                    <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    );
};
