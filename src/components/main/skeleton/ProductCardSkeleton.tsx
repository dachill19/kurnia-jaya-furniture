import { Skeleton } from "../../ui/skeleton";

export const ProductCardSkeleton = () => {
    return (
        <div className="card-product group h-full">
            <div className="block h-full">
                {/* Image skeleton */}
                <div className="relative pt-[100%] overflow-hidden">
                    <Skeleton className="absolute top-0 left-0 w-full h-full" />
                </div>

                {/* Content skeleton */}
                <div className="p-4">
                    {/* Category */}
                    <Skeleton className="h-4 w-20 mb-2" />

                    {/* Product name */}
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-5 w-3/4 mb-3" />

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <Skeleton className="h-4 w-16 mr-2" />
                        <Skeleton className="h-4 w-8" />
                    </div>

                    {/* Price and button */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};
