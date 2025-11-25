"use client";

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, MessageCircle, MapPin, Briefcase, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SavedProfessional {
    id: string;
    notes: string | null;
    savedAt: string;
    professional: {
        id: string;
        firstName: string;
        lastName: string;
        profileHeadline: string | null;
        currentTitle: string | null;
        locationCity: string;
        locationState: string;
        verificationStatus: string;
        skills: string[];
    };
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ApiResponse {
    savedProfessionals: SavedProfessional[];
    pagination: PaginationInfo;
}

const SavedProfessionalsPage = () => {
    const [savedProfessionals, setSavedProfessionals] = useState<SavedProfessional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const router = useRouter();

    const fetchSavedProfessionals = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/v1/professionals/saved?page=${page}&limit=20`);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required');
                } else if (response.status === 403) {
                    throw new Error('Insufficient permissions');
                } else {
                    throw new Error('Failed to fetch saved professionals');
                }
            }

            const data: ApiResponse = await response.json();
            setSavedProfessionals(data.savedProfessionals);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.message || 'Failed to load saved professionals');
            console.error('Error fetching saved professionals:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSavedProfessionals();
    }, [fetchSavedProfessionals]);

    const handleRemoveSaved = async (savedId: string, professionalName: string) => {
        try {
            const response = await fetch(`/api/v1/professionals/${savedId}/save`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to remove professional from saved list');
            }

            toast.success(`${professionalName} has been removed from your saved list`);
            // Refresh the list
            fetchSavedProfessionals(pagination.page);
        } catch (err: unknown) {
            console.error('Remove saved professional error:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to remove professional from saved list');
        }
    };

    const handleRequestIntroduction = async (professionalId: string, professionalName: string) => {
        // TODO: Implement introduction request
        toast.info('Introduction request feature coming soon');
    };

    const handlePageChange = (page: number) => {
        fetchSavedProfessionals(page);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                        <Button
                            onClick={() => fetchSavedProfessionals()}
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
                    <h1 className="text-2xl font-bold text-foreground mb-2">Saved Professionals</h1>
                    <p className="text-muted-foreground">
                        Professionals you've saved for future reference
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Bookmark className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">{pagination.total}</p>
                                    <p className="text-sm text-muted-foreground">Total Saved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Saved Professionals List */}
                {savedProfessionals.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No saved professionals yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start browsing talents and save professionals you're interested in for later.
                        </p>
                        <Button onClick={() => router.push('/dashboard/search')}>
                            Browse Talents
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {savedProfessionals.map((saved) => (
                            <Card key={saved.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Avatar className="h-16 w-16">
                                            {/* <AvatarImage src={undefined} /> */}
                                            <AvatarFallback className="bg-green-100 text-green-700">
                                                {saved.professional.firstName[0] || '?'}{saved.professional.lastName[0] || '?'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {saved.professional.firstName} {saved.professional.lastName}
                                                        {saved.professional.verificationStatus === 'VERIFIED' && (
                                                            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </h3>
                                                    {saved.professional.profileHeadline && (
                                                        <p className="text-gray-600 mb-1">{saved.professional.profileHeadline}</p>
                                                    )}
                                                    {saved.professional.currentTitle && (
                                                        <p className="text-gray-600 text-sm">{saved.professional.currentTitle}</p>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                                                    Saved {new Date(saved.savedAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {saved.professional.locationCity}, {saved.professional.locationState}
                                                </div>
                                            </div>

                                            {saved.professional.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {saved.professional.skills.slice(0, 5).map((skill, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {saved.professional.skills.length > 5 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{saved.professional.skills.length - 5} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {saved.notes && (
                                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        <strong>Notes:</strong> {saved.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 md:min-w-[200px]">
                                            <Button
                                                onClick={() => router.push(`/dashboard/professionals/${saved.professional.id}`)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                View Profile
                                            </Button>
                                            <Button
                                                onClick={() => handleRequestIntroduction(saved.professional.id, `${saved.professional.firstName} ${saved.professional.lastName}`)}
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Request Intro
                                            </Button>
                                            <Button
                                                onClick={() => handleRemoveSaved(saved.id, `${saved.professional.firstName} ${saved.professional.lastName}`)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedProfessionalsPage;
