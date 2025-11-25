import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

const Pagination = ({ pagination, onPageChange, loading }: PaginationProps) => {
    if (pagination.total === 0) return null;

    const startItem = ((pagination.page - 1) * pagination.limit) + 1;
    const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {pagination.total} {pagination.total === 1 ? 'result' : 'results'}
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev || loading}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {/* Show page numbers */}
                    {pagination.totalPages <= 7 ? (
                        // Show all pages if 7 or fewer
                        Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Button
                                key={pageNum}
                                variant={pageNum === pagination.page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNum)}
                                disabled={loading}
                                className="w-8 h-8 p-0"
                            >
                                {pageNum}
                            </Button>
                        ))
                    ) : (
                        // Show abbreviated pagination for more than 7 pages
                        <>
                            {pagination.page > 3 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(1)}
                                        disabled={loading}
                                        className="w-8 h-8 p-0"
                                    >
                                        1
                                    </Button>
                                    {pagination.page > 4 && (
                                        <span className="px-2 text-muted-foreground">...</span>
                                    )}
                                </>
                            )}

                            {Array.from(
                                { length: Math.min(5, pagination.totalPages) },
                                (_, i) => {
                                    const pageNum = Math.max(1, Math.min(
                                        pagination.page - 2 + i,
                                        pagination.totalPages - 4 + i
                                    ));
                                    return pageNum;
                                }
                            )
                                .filter((pageNum, index, array) => array.indexOf(pageNum) === index)
                                .map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === pagination.page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNum)}
                                        disabled={loading}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNum}
                                    </Button>
                                ))}

                            {pagination.page < pagination.totalPages - 2 && (
                                <>
                                    {pagination.page < pagination.totalPages - 3 && (
                                        <span className="px-2 text-muted-foreground">...</span>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(pagination.totalPages)}
                                        disabled={loading}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pagination.totalPages}
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext || loading}
                    className="flex items-center gap-1"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
