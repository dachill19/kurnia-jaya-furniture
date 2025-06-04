import { ProductCardSkeleton } from "./ProductCardSkeleton";

export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
};
