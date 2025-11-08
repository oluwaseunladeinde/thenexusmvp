const JobsSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <div className="h-8 bg-muted rounded w-48 mb-2"></div>
                        <div className="h-5 bg-muted rounded w-80"></div>
                    </div>
                    <div className="h-10 w-32 bg-muted rounded"></div>
                </div>

                {/* Search and Filters Skeleton */}
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <div className="flex-1 h-10 bg-muted rounded"></div>
                        <div className="h-10 w-32 bg-muted rounded"></div>
                    </div>
                    
                    {/* Results Summary Skeleton */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
                        <div className="h-5 bg-muted rounded w-24"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-5 bg-muted rounded w-10"></div>
                            <div className="h-10 w-28 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Job Cards Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card rounded-lg border border-border p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-6 bg-muted rounded w-48"></div>
                                        <div className="h-5 bg-muted rounded w-16"></div>
                                        <div className="h-5 bg-muted rounded w-12"></div>
                                    </div>
                                    <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                                    <div className="h-4 bg-muted rounded w-20"></div>
                                </div>
                                <div className="h-8 w-8 bg-muted rounded"></div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="h-4 bg-muted rounded w-64"></div>
                                <div className="h-4 bg-muted rounded w-56"></div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-4 bg-muted rounded w-24"></div>
                                    <div className="h-4 bg-muted rounded w-20"></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 h-8 bg-muted rounded"></div>
                                <div className="flex-1 h-8 bg-muted rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobsSkeleton;
