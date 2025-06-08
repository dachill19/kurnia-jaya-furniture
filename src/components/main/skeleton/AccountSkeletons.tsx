import { Skeleton } from "@/components/ui/skeleton";

export const ProfileTabSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-4 border-b flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-20 rounded" />
            </div>

            {/* Form Skeleton */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AddressItemSkeleton = () => {
    return (
        <div className="border rounded-md p-4 relative">
            <Skeleton className="absolute top-4 right-4 h-6 w-16 rounded-full" />
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex space-x-2">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-28 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
            </div>
        </div>
    );
};

export const AddressTabSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-4 border-b flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-32 rounded" />
            </div>

            {/* Address List Skeleton */}
            <div className="p-4 space-y-4">
                <AddressItemSkeleton />
                <AddressItemSkeleton />
            </div>
        </div>
    );
};

export const AddAddressTabSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <Skeleton className="h-5 w-32" />
            </div>

            {/* Form Skeleton */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div className="md:col-span-2 flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <Skeleton className="h-10 w-24 rounded" />
                        <Skeleton className="h-10 w-32 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EditAddressTabSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <Skeleton className="h-5 w-32" />
            </div>

            {/* Form Skeleton */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div className="md:col-span-2 flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <Skeleton className="h-10 w-24 rounded" />
                        <Skeleton className="h-10 w-32 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const OrderItemSkeleton = () => {
    return (
        <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                    <Skeleton className="h-4 w-24 mr-4" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center py-2">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="ml-3 flex-grow">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded" />
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-32 rounded" />
                <Skeleton className="h-8 w-32 rounded" />
            </div>
        </div>
    );
};

export const OrdersTabSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <Skeleton className="h-5 w-24" />
            </div>

            {/* Orders List Skeleton */}
            <div className="divide-y">
                <OrderItemSkeleton />
                <OrderItemSkeleton />
            </div>
        </div>
    );
};

export const WishlistItemSkeleton = () => {
    return (
        <div className="border rounded-md p-3 flex">
            <Skeleton className="w-20 h-20 rounded-md" />
            <div className="ml-3 flex-grow">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <div className="flex space-x-2">
                    <Skeleton className="h-8 w-40 rounded" />
                    <Skeleton className="h-8 w-24 rounded" />
                </div>
            </div>
        </div>
    );
};

export const WishlistTabSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <Skeleton className="h-5 w-24" />
            </div>

            {/* Wishlist Items Skeleton */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <WishlistItemSkeleton />
                <WishlistItemSkeleton />
            </div>
        </div>
    );
};