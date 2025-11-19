import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-background" role="status" aria-busy="true" aria-label="Loading dashboard content">
            <span className="sr-only">Loading dashboard content...</span>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Left Sidebar Skeleton */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Profile Card Skeleton */}
                        <div className="bg-card rounded-lg shadow border border-border">
                            <div className="p-6 text-center">
                                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded mx-auto mb-2 w-32 animate-pulse"></div>
                                <div className="h-3 bg-muted rounded mx-auto mb-3 w-40 animate-pulse"></div>
                                <div className="flex justify-center gap-4 mb-4">
                                    <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                                    <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="h-3 bg-muted rounded w-16 mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-8 animate-pulse"></div>
                                    </div>
                                    <div>
                                        <div className="h-3 bg-muted rounded w-20 mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-10 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4">
                                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Quick Actions Skeleton */}
                        <div className="bg-card rounded-lg shadow border border-border p-4">
                            <div className="h-4 bg-muted rounded w-24 mb-3 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-8 bg-muted rounded animate-pulse"></div>
                                <div className="h-8 bg-muted rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Feed Skeleton */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Profile Completeness Skeleton */}
                        <div className="bg-card rounded-lg shadow border border-border p-6">
                            <div className="flex justify-between mb-3">
                                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-8 animate-pulse"></div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-4 animate-pulse"></div>
                            <div className="h-3 bg-muted rounded w-64 mb-4 animate-pulse"></div>
                            <div className="h-8 bg-muted rounded w-32 animate-pulse"></div>
                        </div>

                        {/* Feed Posts Skeleton */}
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-card rounded-lg shadow border border-border p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-muted rounded w-24 mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="h-5 bg-muted rounded w-48 mb-2 animate-pulse"></div>
                                    <div className="flex gap-4 mb-3">
                                        <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                                        <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-muted rounded w-full animate-pulse"></div>
                                        <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4 border-t">
                                    <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
                                    <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
                                    <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Sidebar Skeleton */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Analytics Skeleton */}
                        <div className="bg-card rounded-lg shadow border border-border p-4">
                            <div className="h-4 bg-muted rounded w-24 mb-3 animate-pulse"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                                        <div className="h-3 bg-muted rounded w-6 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Career Tools Skeleton */}
                        <div className="bg-card rounded-lg shadow border border-border p-4">
                            <div className="h-4 bg-muted rounded w-20 mb-3 animate-pulse"></div>
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex justify-between p-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                                            <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                                        </div>
                                        <div className="h-3 bg-muted rounded w-8 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions Skeleton */}
                        <div className="bg-card rounded-lg shadow border border-border p-4">
                            <div className="h-4 bg-muted rounded w-32 mb-3 animate-pulse"></div>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-muted rounded w-20 mb-1 animate-pulse"></div>
                                            <div className="h-3 bg-muted rounded w-full mb-2 animate-pulse"></div>
                                            <div className="h-3 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                                            <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
