"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Briefcase, Star, MessageCircle, Eye, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TalentCard from '@/components/hr-partner/talents/TalentCard';
import TalentFilters from '@/components/hr-partner/talents/TalentFilters';
import TalentsSkeleton from '@/components/hr-partner/talents/TalentsSkeleton';
import EmptyTalentsState from '@/components/hr-partner/talents/EmptyTalentsState';
import Pagination from '@/components/hr-partner/talents/Pagination';
import SearchHeader from '@/components/hr-partner/talents/SearchHeader';

interface Professional {
    id: number;
    name: string;
    initials: string;
    profileHeadline: string;
    profilePhotoUrl?: string;
    location: string;
    experience: number;
    currentTitle: string;
    currentCompany: string;
    industry: string;
    salaryRange: string | null;
    verificationStatus: string;
    isVerified: boolean;
    topSkills: string[];
    profileViews: number;
    isConfidential: boolean;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface ApiResponse {
    professionals: Professional[];
    pagination: PaginationInfo;
}

const TalentsPage = () => {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        experience: '',
        skills: '',
        availability: '',
        salaryRange: ''
    });
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const [searchSessionId, setSearchSessionId] = useState<string | null>(null);

    const fetchProfessionals = useCallback(async (page: number = 1, query?: string, filterState?: typeof filters) => {
        try {
            setLoading(true);
            setError(null);

            // Use provided params or current state
            const currentQuery = query !== undefined ? query : searchQuery;
            const currentFilters = filterState !== undefined ? filterState : filters;

            // Track search interactions
            if (currentQuery || Object.values(currentFilters).some(f => f !== '')) {
                // Generate or use existing session ID
                let sessionId = searchSessionId;
                if (!sessionId) {
                    sessionId = `frontend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    setSearchSessionId(sessionId);
                }

                // Track filter changes
                if (filterState) {
                    try {
                        await fetch('/api/v1/analytics/track', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType: 'SEARCH_FILTER_CHANGE',
                                sessionId,
                                data: {
                                    filters: currentFilters,
                                    query: currentQuery,
                                    page,
                                    timestamp: new Date().toISOString(),
                                },
                            }),
                        });
                    } catch (error) {
                        console.error('Analytics tracking failed:', error);
                    }
                }
            }

            // Map filters to API format
            const apiFilters: any = {
                page,
                limit: 20,
            };

            if (currentQuery.trim()) {
                apiFilters.query = currentQuery.trim();
            }

            // Location mapping
            if (currentFilters.location) {
                if (currentFilters.location === 'Remote') {
                    // Handle remote separately if needed
                } else {
                    apiFilters.location = { city: currentFilters.location };
                }
            }

            // Experience mapping
            if (currentFilters.experience) {
                const minExp = parseInt(currentFilters.experience);
                apiFilters.experienceRange = { min: minExp };
            }

            // Skills mapping
            if (currentFilters.skills.trim()) {
                apiFilters.skills = currentFilters.skills.split(',').map(s => s.trim()).filter(s => s);
            }

            // Availability mapping (API uses openToOpportunities, but we map to verification status for now)
            if (currentFilters.availability) {
                // Map availability to verification status
                const statusMap: Record<string, string> = {
                    'available': 'VERIFIED',
                    'open': 'BASIC',
                    'not_looking': 'UNVERIFIED'
                };
                apiFilters.verificationStatus = statusMap[currentFilters.availability];
            }

            const response = await fetch('/api/v1/professionals/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiFilters),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required');
                } else if (response.status === 403) {
                    throw new Error('Insufficient permissions');
                } else {
                    throw new Error('Failed to fetch professionals');
                }
            }

            const data: ApiResponse = await response.json();
            setProfessionals(data.professionals);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.message || 'Failed to load professionals');
            console.error('Error fetching professionals:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, searchSessionId]);

    useEffect(() => {
        fetchProfessionals();
    }, [fetchProfessionals]);

    // Debounced search effect
    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            fetchProfessionals(1, searchQuery, filters);
        }, 500);

        setDebounceTimer(timer);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [searchQuery, filters, fetchProfessionals]);

    const handlePageChange = (page: number) => {
        fetchProfessionals(page);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            experience: '',
            skills: '',
            availability: '',
            salaryRange: ''
        });
        setSearchQuery('');
    };

    if (loading) {
        return <TalentsSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                        <Button
                            onClick={() => fetchProfessionals()}
                            className="mt-2"
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Browse Talents</h1>
                    <p className="text-muted-foreground">
                        Discover and connect with verified senior professionals
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <SearchHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        showFilters={showFilters}
                        onToggleFilters={() => setShowFilters(!showFilters)}
                        resultsCount={pagination.total}
                        loading={loading}
                    />

                    {showFilters && (
                        <TalentFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />
                    )}

                    {/* Results Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
                        <p className="text-sm text-muted-foreground">
                            {pagination.total} talents found
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort:</span>
                            <Select defaultValue="relevance">
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                                    <SelectItem value="relevance" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Relevance</SelectItem>
                                    <SelectItem value="experience" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Experience</SelectItem>
                                    <SelectItem value="location" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Location</SelectItem>
                                    <SelectItem value="recent" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Recent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Talent Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {professionals.map((professional) => (
                        <TalentCard
                            key={professional.id}
                            professional={professional}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                )}

                {/* Empty State */}
                {professionals.length === 0 && !loading && (
                    <EmptyTalentsState
                        hasFilters={Object.values(filters).some(f => f !== '') || searchQuery !== ''}
                        onClearFilters={clearFilters}
                    />
                )}
            </div>
        </div>
    );
};

export default TalentsPage;