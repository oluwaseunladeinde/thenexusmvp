import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface Filters {
    location: string;
    experience: string;
    skills: string;
    availability: string;
    salaryRange: string;
}

interface TalentFiltersProps {
    filters: Filters;
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
}

const TalentFilters = ({ filters, onFilterChange, onClearFilters }: TalentFiltersProps) => {
    return (
        <div className="border-t border-border pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Location
                    </label>
                    <Select value={filters.location || undefined} onValueChange={(value) => onFilterChange('location', value || '')}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any location" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                            <SelectItem value="Lagos" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Lagos</SelectItem>
                            <SelectItem value="Abuja" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Abuja</SelectItem>
                            <SelectItem value="Port Harcourt" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Port Harcourt</SelectItem>
                            <SelectItem value="Kano" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Kano</SelectItem>
                            <SelectItem value="Remote" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Remote</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Experience
                    </label>
                    <Select value={filters.experience || undefined} onValueChange={(value) => onFilterChange('experience', value || '')}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any experience" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                            <SelectItem value="2" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">2+ years</SelectItem>
                            <SelectItem value="5" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">5+ years</SelectItem>
                            <SelectItem value="8" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">8+ years</SelectItem>
                            <SelectItem value="10" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">10+ years</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Skills */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Skills
                    </label>
                    <Input
                        placeholder="e.g. React, Python"
                        value={filters.skills}
                        onChange={(e) => onFilterChange('skills', e.target.value)}
                    />
                </div>

                {/* Availability */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Availability
                    </label>
                    <Select value={filters.availability || undefined} onValueChange={(value) => onFilterChange('availability', value || '')}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any availability" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                            <SelectItem value="available" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Actively Looking</SelectItem>
                            <SelectItem value="open" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Open to Offers</SelectItem>
                            <SelectItem value="not_looking" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Not Looking</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-3 lg:mt-4">
                <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="w-full lg:w-auto flex items-center justify-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Clear All Filters
                </Button>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    
                    const getFilterLabel = (key: string, value: string) => {
                        switch (key) {
                            case 'location': return `Location: ${value}`;
                            case 'experience': return `${value}+ years exp`;
                            case 'skills': return `Skills: ${value}`;
                            case 'availability': 
                                const availabilityMap: Record<string, string> = {
                                    'available': 'Actively Looking',
                                    'open': 'Open to Offers',
                                    'not_looking': 'Not Looking'
                                };
                                return availabilityMap[value] || value;
                            default: return value;
                        }
                    };

                    return (
                        <span
                            key={key}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                            {getFilterLabel(key, value)}
                            <button
                                onClick={() => onFilterChange(key, '')}
                                className="hover:bg-primary/20 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default TalentFilters;
