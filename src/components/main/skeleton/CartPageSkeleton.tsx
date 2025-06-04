import { Skeleton } from "../../ui/skeleton";

export const CartItemSkeleton = () => {
    return (
        <div className="p-4 border-b flex flex-col sm:flex-row items-center">
            {/* Product Image Skeleton */}
            <div className="w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                <Skeleton className="w-full h-full rounded-md" />
            </div>

            {/* Product Details Skeleton */}
            <div className="flex-grow sm:ml-4 sm:mr-4 text-center sm:text-left">
                <Skeleton className="h-5 w-3/4 mb-2 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-1/2 mx-auto sm:mx-0" />
            </div>

            {/* Quantity Control Skeleton */}
            <div className="flex items-center mt-4 sm:mt-0">
                <Skeleton className="w-8 h-8 rounded-l-md" />
                <Skeleton className="w-10 h-8" />
                <Skeleton className="w-8 h-8 rounded-r-md" />
                <Skeleton className="ml-4 h-4 w-20" />
                <Skeleton className="ml-4 w-5 h-5 rounded" />
            </div>
        </div>
    );
};

export const CartListSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-20 rounded" />
                </div>
            </div>

            {/* Cart Items Skeleton */}
            <div>
                {Array.from({ length: count }).map((_, index) => (
                    <CartItemSkeleton key={index} />
                ))}
            </div>

            {/* Continue Shopping Button Skeleton */}
            <div className="p-4">
                <Skeleton className="h-10 w-40 rounded" />
            </div>
        </div>
    );
};

export const OrderSummarySkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <Skeleton className="h-5 w-32" />
            </div>

            <div className="p-4">
                {/* Price Summary Skeleton */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="pt-3 border-t flex justify-between">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>

                {/* Checkout Button Skeleton */}
                <Skeleton className="w-full h-12 rounded" />
            </div>
        </div>
    );
};

export const CartPageSkeleton = () => {
    return (
        <div className="container-custom py-8">
            {/* Page Title Skeleton */}
            <Skeleton className="h-8 w-48 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items Skeleton */}
                <div className="lg:col-span-2">
                    <CartListSkeleton count={3} />
                </div>

                {/* Order Summary Skeleton */}
                <div className="lg:col-span-1">
                    <OrderSummarySkeleton />
                </div>
            </div>
        </div>
    );
};
