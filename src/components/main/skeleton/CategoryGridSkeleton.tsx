import { CategoryCardSkeleton } from "./CategoryCardSkeleton";

export const CategoryGridSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <CategoryCardSkeleton key={index} />
            ))}
        </div>
    );
};
