import { Skeleton } from "../ui/skeleton";

export const ProductImagesSkeleton = () => {
    return (
        <div>
            {/* Main Image Skeleton */}
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                <Skeleton className="w-full h-[400px]" />
            </div>

            {/* Thumbnail Images Skeleton */}
            <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="w-20 h-20 rounded-md" />
                ))}
            </div>
        </div>
    );
};

export const ProductInfoSkeleton = () => {
    return (
        <div>
            {/* Product Title Skeleton */}
            <Skeleton className="h-8 w-3/4 mb-3" />

            {/* Rating Skeleton */}
            <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-4 h-4 rounded-full" />
                    ))}
                </div>
                <Skeleton className="ml-2 h-4 w-24" />
            </div>

            {/* Price Skeleton */}
            <div className="mb-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-8 w-40" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/5 mb-4" />

                {/* Stock Info Skeleton */}
                <div className="flex items-center">
                    <Skeleton className="w-4 h-4 rounded-full mr-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Quantity Selector Skeleton */}
            <div className="mb-6">
                <Skeleton className="h-5 w-16 mb-3" />
                <div className="flex">
                    <Skeleton className="w-10 h-10 rounded-l-md" />
                    <Skeleton className="w-12 h-10" />
                    <Skeleton className="w-10 h-10 rounded-r-md" />
                </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                <Skeleton className="h-12 w-full sm:flex-1 rounded" />
            </div>

            {/* Extra Actions Skeleton */}
            <div className="flex space-x-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
            </div>
        </div>
    );
};

export const BreadcrumbSkeleton = () => {
    return (
        <nav className="flex mb-6 text-sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mx-2 w-4 h-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mx-2 w-4 h-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mx-2 w-4 h-4" />
            <Skeleton className="h-4 w-32" />
        </nav>
    );
};

export const ReviewItemSkeleton = () => {
    return (
        <div className="border-b pb-6">
            {/* Review Header */}
            <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
            </div>

            {/* Rating Stars */}
            <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-4 h-4 rounded-full mr-1" />
                ))}
            </div>

            {/* Review Comment */}
            <div className="mb-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Review Images */}
            <div className="flex space-x-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="w-20 h-20 rounded-md" />
                ))}
            </div>
        </div>
    );
};

export const ReviewsSectionSkeleton = () => {
    return (
        <div className="mb-6">
            {/* Reviews Header */}
            <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-6 h-6 rounded-full mr-1"
                        />
                    ))}
                </div>
                <Skeleton className="h-6 w-16 mr-2" />
                <Skeleton className="h-4 w-20" />
            </div>

            {/* Review List */}
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <ReviewItemSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export const ProductDetailPageSkeleton = () => {
    return (
        <div className="container-custom py-8">
            {/* Breadcrumb Skeleton */}
            <BreadcrumbSkeleton />

            {/* Product Detail Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Product Images Skeleton */}
                <ProductImagesSkeleton />

                {/* Product Info Skeleton */}
                <ProductInfoSkeleton />
            </div>

            {/* Reviews Section Skeleton */}
            <ReviewsSectionSkeleton />
        </div>
    );
};
