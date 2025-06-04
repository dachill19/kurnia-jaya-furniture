import { Skeleton } from "../../ui/skeleton";

export const CategoryCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
};
