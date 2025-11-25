import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    resultsCount?: number;
    loading?: boolean;
}

const SearchHeader = ({
    searchQuery,
    onSearchChange,
    showFilters,
    onToggleFilters,
    resultsCount,
    loading
}: SearchHeaderProps) => {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Search Professionals</h1>
                    <p className="text-gray-600">Find and connect with verified senior professionals</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onToggleFilters}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                <Input
                    placeholder="Search by title, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results Summary */}
            {resultsCount !== undefined && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {loading ? 'Searching...' : `${resultsCount} professional${resultsCount !== 1 ? 's' : ''} found`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchHeader;
