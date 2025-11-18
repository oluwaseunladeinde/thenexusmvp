'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, Clock, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { IntroductionDetailView } from '@/components/hr-partner/IntroductionDetailView';
import { toast } from 'sonner';

interface IntroductionRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    personalizedMessage: string;
    professionalResponse?: string;
    sentAt: string;
    responseDate?: string;
    expiresAt: string;
    viewedByProfessional: boolean;
    viewedAt?: string;
    jobRole: {
        id: string;
        roleTitle: string;
        roleDescription: string;
        seniorityLevel: string;
        locationCity: string;
        locationState: string;
        salaryRangeMin?: number;
        salaryRangeMax?: number;
        remoteOption: string;
        employmentType: string;
        responsibilities?: string;
        requirements: string;
        preferredQualifications?: string;
        benefits?: string;
        isConfidential: boolean;
    };
    professional: {
        id: string;
        firstName: string;
        lastName: string;
        profileHeadline?: string;
        currentTitle?: string;
        locationCity: string;
        locationState: string;
        profilePhotoUrl?: string;
        linkedinUrl?: string;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export default function IntroductionsPage() {
    const [introductions, setIntroductions] = useState<IntroductionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [selectedIntroduction, setSelectedIntroduction] = useState<IntroductionRequest | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchIntroductions = async (page = 1, status = 'all') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                status,
            });

            const response = await fetch(`/api/v1/introductions/sent?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch introductions');
            }

            setIntroductions(data.data.introductions);
            setPagination(data.data.pagination);
        } catch (error) {
            console.error('Error fetching introductions:', error);
            toast.error('Failed to load introduction requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntroductions(currentPage, statusFilter);
    }, [currentPage, statusFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'ACCEPTED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'DECLINED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'EXPIRED':
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
            default:
                return null;
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'secondary';
            case 'ACCEPTED':
                return 'default';
            case 'DECLINED':
                return 'destructive';
            case 'EXPIRED':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const filteredIntroductions = introductions.filter(intro => {
        const matchesSearch = searchQuery === '' ||
            intro.professional.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            intro.professional.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            intro.jobRole.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const groupedIntroductions = filteredIntroductions.reduce((groups, intro) => {
        if (!groups[intro.status]) {
            groups[intro.status] = [];
        }
        groups[intro.status].push(intro);
        return groups;
    }, {} as Record<string, IntroductionRequest[]>);

    const handleViewDetails = (introduction: IntroductionRequest) => {
        setSelectedIntroduction(introduction);
        setDetailModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Introduction Requests</h1>
                <p className="text-gray-600">Manage your sent introduction requests</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by professional name or job role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                <SelectItem value="DECLINED">Declined</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">Loading introduction requests...</span>
                </div>
            )}

            {/* Introduction Groups */}
            {!loading && Object.keys(groupedIntroductions).length > 0 && (
                <div className="space-y-8">
                    {Object.entries(groupedIntroductions).map(([status, intros]) => (
                        <div key={status}>
                            <div className="flex items-center mb-4">
                                {getStatusIcon(status)}
                                <h2 className="text-xl font-semibold ml-2 capitalize">
                                    {status.toLowerCase()} ({intros.length})
                                </h2>
                            </div>

                            <div className="grid gap-4">
                                {intros.map((intro) => (
                                    <Card key={intro.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                {intro.professional.firstName} {intro.professional.lastName}
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                {intro.professional.currentTitle} • {intro.professional.locationCity}, {intro.professional.locationState}
                                                            </p>
                                                        </div>
                                                        <Badge variant={getStatusBadgeVariant(intro.status) as any}>
                                                            {intro.status.toLowerCase()}
                                                        </Badge>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="font-medium text-gray-900">{intro.jobRole.roleTitle}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {intro.jobRole.locationCity}, {intro.jobRole.locationState} • {intro.jobRole.seniorityLevel}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-500 gap-4">
                                                        <span>Sent {formatDate(intro.sentAt)}</span>
                                                        {intro.viewedByProfessional && (
                                                            <span className="flex items-center">
                                                                <Eye className="w-3 h-3 mr-1" />
                                                                Viewed
                                                            </span>
                                                        )}
                                                        {intro.responseDate && (
                                                            <span>Responded {formatDate(intro.responseDate)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(intro)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && Object.keys(groupedIntroductions).length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No introduction requests found</h3>
                        <p className="text-gray-600">
                            {statusFilter !== 'all' || searchQuery
                                ? 'Try adjusting your filters or search query.'
                                : 'You haven\'t sent any introduction requests yet.'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={!pagination.hasPrev}
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                        disabled={!pagination.hasNext}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Detail Modal */}
            {selectedIntroduction && (
                <IntroductionDetailView
                    introduction={selectedIntroduction}
                    open={detailModalOpen}
                    onOpenChange={setDetailModalOpen}
                />
            )}
        </div>
    );
}
