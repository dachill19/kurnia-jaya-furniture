import { Skeleton } from "@/components/ui/skeleton";

export const OrderDetailTabSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Skeleton className="h-8 w-20 rounded mr-2" />
                        <div>
                            <Skeleton className="h-6 w-40 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-4">
                            {/* Order Item 1 */}
                            <div className="flex items-center p-4 border rounded-lg">
                                <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                                <div className="flex-grow ml-4">
                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-20 rounded ml-4" />
                            </div>
                            {/* Order Item 2 */}
                            <div className="flex items-center p-4 border rounded-lg">
                                <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                                <div className="flex-grow ml-4">
                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-20 rounded ml-4" />
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-4">
                            {/* Timeline Item 1 */}
                            <div className="flex items-center">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div className="ml-3">
                                    <Skeleton className="h-5 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            {/* Timeline Item 2 */}
                            <div className="flex items-center">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div className="ml-3">
                                    <Skeleton className="h-5 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            {/* Timeline Item 3 */}
                            <div className="flex items-center">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div className="ml-3">
                                    <Skeleton className="h-5 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-6">
                    {/* Order Summary Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-6 w-6 rounded" />
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>

                    {/* Payment Information Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full rounded" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};