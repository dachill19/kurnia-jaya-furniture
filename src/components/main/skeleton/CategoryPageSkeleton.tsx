import { ProductGridSkeleton } from "./ProductGridSkeleton";

export const CategoryPageSkeleton = () => {
    return (
        <div className="container-custom py-8">
            <div className="h-48 md:h-64 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-6 w-64"></div>
            <ProductGridSkeleton count={4} />
        </div>
    );
};
