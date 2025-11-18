'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/professional/JobCard';
import { IntroductionDetailModal } from '@/components/professional/IntroductionDetailModal';
import {
    Inbox,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    TrendingUp,
    Search
} from 'lucide-react';
import { toast } from 'sonner';

interface IntroductionRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    personalizedMessage?: string;
    sentAt: string;
    expiresAt: string;
    viewedByProfessional: boolean;
    matchScore?: number;
    jobRole: {
        roleTitle: string;
        seniorityLevel: string;
        locationCity: string;
        locationState: string;
        salaryRangeMin: number;
        salaryRangeMax: number;
        remoteOption: string;
        employmentType: string;
    };
    company: {
        id: string;
        companyName: string;
        companyLogoUrl?: string;
        industry: string;
        companySize: string;
    };
    sentBy: {
        firstName: string;
        lastName: string;
        jobTitle: string;
        profilePhotoUrl?: string;
    };
}

export default function IntroductionRequestsPage() {
    const [introductions, setIntroductions] = useState<IntroductionRequest[]>([]);
    const [allIntroductions, setAllIntroductions] = useState<IntroductionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [profileCompleteness, setProfileCompleteness] = useState(0); // Start with 0 to show card by default
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIntroduction, setSelectedIntroduction] = useState<IntroductionRequest | null>(null);
    const itemsPerPage = 5;

    // Fetch introduction requests and profile data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch introduction requests
                const introResponse = await fetch('/api/v1/introductions/received');
                if (introResponse.ok) {
                    const introData = await introResponse.json();
                    setAllIntroductions(introData.introductions || []);
                    setIntroductions(introData.introductions || []); // Set initial filtered data
                }

                // Fetch profile completeness
                const profileResponse = await fetch('/api/v1/professionals/me');
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setProfileCompleteness(profileData.completenessPercentage || 75); // Default to 75% if not provided
                } else {
                    setProfileCompleteness(75); // Default to 75% if API fails
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load introduction requests');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const applyFilters = (
        source: IntroductionRequest[],
        filter: string,
        queryText: string
    ) => {
        const now = new Date();
        let filteredData = source;

        if (filter === 'pending') {
            filteredData = filteredData.filter(
                intro => intro.status === 'PENDING' && new Date(intro.expiresAt) > now
            );
        } else if (filter === 'expired') {
            filteredData = filteredData.filter(
                intro => intro.status === 'PENDING' && new Date(intro.expiresAt) <= now
            );
        } else if (filter !== 'all') {
            filteredData = filteredData.filter(
                intro => intro.status.toLowerCase() === filter.toLowerCase()
            );
        }

        const normalizedQuery = queryText.trim().toLowerCase();

        if (normalizedQuery) {
            filteredData = filteredData.filter(intro =>
                intro.jobRole.roleTitle.toLowerCase().includes(normalizedQuery) ||
                intro.company.companyName.toLowerCase().includes(normalizedQuery) ||
                intro.company.industry.toLowerCase().includes(normalizedQuery) ||
                intro.jobRole.locationCity.toLowerCase().includes(normalizedQuery)
            );
        }

        return filteredData;
    };

    const handleFilterChange = (
        filter: string,
        overrideQuery?: string,
        dataOverride?: IntroductionRequest[]
    ) => {
        setActiveFilter(filter);
        setCurrentPage(1);

        const queryText = (overrideQuery ?? searchQuery) ?? '';
        const dataset = dataOverride ?? allIntroductions;

        setIntroductions(applyFilters(dataset, filter, queryText));
    };


    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page when search changes
        handleFilterChange(activeFilter, query); // Re-apply current filter with search
    };

    const handleAccept = async (id: string) => {
        try {
            const response = await fetch(`/api/v1/introductions/${id}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                toast.success('Introduction request accepted!');
                setAllIntroductions(prev =>
                    prev.map(intro =>
                        intro.id === id ? { ...intro, status: 'ACCEPTED' as const } : intro
                    )
                );
                handleFilterChange(activeFilter);
            } else {
                toast.error('Failed to accept introduction request');
            }
        } catch (error) {
            console.error('Error accepting introduction:', error);
            toast.error('Failed to accept introduction request');
        }
    };

    const handleDecline = async (id: string) => {
        try {
            const response = await fetch(`/api/v1/introductions/${id}/decline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                toast.success('Introduction request declined');
                const updated = allIntroductions.map(intro =>
                    intro.id === id ? { ...intro, status: 'DECLINED' as const } : intro
                );
                setAllIntroductions(updated);
                handleFilterChange(activeFilter, undefined, updated);
            } else {
                toast.error('Failed to decline introduction request');
            }
        } catch (error) {
            console.error('Error declining introduction:', error);
            toast.error('Failed to decline introduction request');
        }
    };

    const handleViewDetails = (id: string) => {
        const introduction = allIntroductions.find(intro => intro.id === id);
        if (introduction) {
            setSelectedIntroduction(introduction);
        }
    };

    const handleContinueConversation = (id: string) => {
        console.log('Continue conversation for:', id);
    };

    const getCounts = () => {
        const now = new Date();
        return {
            all: allIntroductions.length,
            pending: allIntroductions.filter(i => i.status === 'PENDING' && new Date(i.expiresAt) > now).length,
            accepted: allIntroductions.filter(i => i.status === 'ACCEPTED').length,
            declined: allIntroductions.filter(i => i.status === 'DECLINED').length,
            expired: allIntroductions.filter(i => i.status === 'PENDING' && new Date(i.expiresAt) <= now).length,
        };
    };

    const counts = getCounts();

    // Pagination logic
    const totalPages = Math.ceil(introductions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIntroductions = introductions.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Mobile Filter Tabs */}
                <div className="lg:hidden mb-4">
                    <div className="flex overflow-x-auto gap-2 pb-2">
                        {[
                            { key: 'all', label: 'All', count: counts.all },
                            { key: 'pending', label: 'Pending', count: counts.pending },
                            { key: 'accepted', label: 'Accepted', count: counts.accepted },
                            { key: 'declined', label: 'Declined', count: counts.declined },
                            { key: 'expired', label: 'Expired', count: counts.expired },
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => handleFilterChange(key)}
                                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === key
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                                    }`}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-6 space-y-4">
                            {/* Filter Card */}
                            <Card className='rounded-sm p-2'>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <h1 className="text-lg font-bold">Filter by Status</h1>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { key: 'all', label: 'All', count: counts.all, icon: Inbox },
                                                { key: 'pending', label: 'Pending', count: counts.pending, icon: Clock },
                                                { key: 'accepted', label: 'Accepted', count: counts.accepted, icon: CheckCircle },
                                                { key: 'declined', label: 'Declined', count: counts.declined, icon: XCircle },
                                                { key: 'expired', label: 'Expired', count: counts.expired, icon: TrendingUp },
                                            ].map(({ key, label, count, icon: Icon }) => (
                                                <button
                                                    key={key}
                                                    onClick={() => handleFilterChange(key)}
                                                    className={`w-full flex items-center justify-between p-2 rounded-sm text-sm transition-colors ${activeFilter === key
                                                        ? 'bg-green-500/10 text-primary border border-green-500/20'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        {label}
                                                    </div>
                                                    <Badge variant="light" className="text-xs bg-gray-100 text-gray-700">
                                                        {count}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="p-2 rounded-sm">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            {/* <TrendingUp className="w-4 h-4" /> */}
                                            <h1 className="text-lg font-bold">Quick Stats</h1>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Response Rate</span>
                                                <span className="font-medium">85%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Avg. Match Score</span>
                                                <span className="font-medium">88%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">This Month</span>
                                                <span className="font-medium">{counts.all} requests</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Profile Completeness Card */}
                            {profileCompleteness < 100 && (
                                <Card className="p-2 rounded-sm">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                {/* <TrendingUp className="w-4 h-4" /> */}
                                                <h1 className="text-lg font-bold">Profile Completeness</h1>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-medium">{profileCompleteness}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${profileCompleteness}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    Complete your profile to get better matches
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Full width on mobile */}
                    <div className="lg:col-span-3">
                        {/* Search Component */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by role, company, industry, or location..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full bg-white pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Mobile Profile Completeness */}
                        {profileCompleteness < 100 && (
                            <div className="lg:hidden mb-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    Profile {profileCompleteness}% complete
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${profileCompleteness}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <TrendingUp className="w-5 h-5 text-primary ml-3" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="p-2 rounded-sm">
                                        <CardContent className="p-4">
                                            <div className="animate-pulse space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                    </div>
                                                </div>
                                                <div className="h-16 bg-gray-200 rounded"></div>
                                                <div className="flex gap-2">
                                                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : introductions.length === 0 ? (
                            <Card className="p-2 rounded-sm">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Inbox className="w-12 h-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No introduction requests
                                    </h3>
                                    <p className="text-gray-600 text-center max-w-md">
                                        {activeFilter === 'all'
                                            ? "You haven't received any introduction requests yet."
                                            : `No ${activeFilter} introduction requests found.`
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {paginatedIntroductions.map((introduction) => (
                                    <JobCard
                                        key={introduction.id}
                                        introduction={introduction}
                                        onAccept={handleAccept}
                                        onDecline={handleDecline}
                                        onViewDetails={handleViewDetails}
                                        onContinueConversation={handleContinueConversation}
                                    />
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-6">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm border rounded-lg ${currentPage === page
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedIntroduction && (
                <IntroductionDetailModal
                    introduction={selectedIntroduction}
                    isOpen={!!selectedIntroduction}
                    onClose={() => setSelectedIntroduction(null)}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onContinueConversation={handleContinueConversation}
                />
            )}
        </div>
    );
}
