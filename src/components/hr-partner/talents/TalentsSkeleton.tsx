const TalentsSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Skeleton */}
                <div className="mb-6">
                    <div className="h-8 bg-muted rounded w-48 mb-2"></div>
                    <div className="h-5 bg-muted rounded w-80"></div>
                </div>

                {/* Search and Filters Skeleton */}
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <div className="flex-1 h-10 bg-muted rounded"></div>
                        <div className="h-10 w-32 bg-muted rounded"></div>
                    </div>
                    
                    {/* Results Summary Skeleton */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
                        <div className="h-5 bg-muted rounded w-32"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-5 bg-muted rounded w-10"></div>
                            <div className="h-10 w-28 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Talent Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card rounded-lg border border-border p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-muted rounded w-32 mb-1"></div>
                                        <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                                        <div className="h-3 bg-muted rounded w-20"></div>
                                    </div>
                                </div>
                                <div className="h-5 bg-muted rounded w-12"></div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-4">
                                <div className="h-4 bg-muted rounded w-28"></div>
                                <div className="h-4 bg-muted rounded w-24"></div>
                                <div className="h-4 bg-muted rounded w-20"></div>
                            </div>

                            {/* Skills */}
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-1">
                                    <div className="h-6 bg-muted rounded w-16"></div>
                                    <div className="h-6 bg-muted rounded w-20"></div>
                                    <div className="h-6 bg-muted rounded w-14"></div>
                                </div>
                            </div>

                            {/* Availability & Salary */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-6 bg-muted rounded w-24"></div>
                                <div className="h-5 bg-muted rounded w-20"></div>
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

export default TalentsSkeleton;
