'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface IntroductionRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
    createdAt: string;
    professional: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        profilePicture?: string;
        currentTitle?: string;
        currentCompany?: string;
        yearsOfExperience?: number;
    };
    introductionMessage?: string;
}

interface JobRole {
    id: string;
    roleTitle: string;
    status: string;
    _count: {
        introductionRequests: number;
    };
}

export default function JobRoleApplicantsPage() {
    const router = useRouter();
    const params = useParams();
    const [jobRole, setJobRole] = useState<JobRole | null>(null);
    const [applicants, setApplicants] = useState<IntroductionRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!params.id) return;
        fetchData();
    }, [params.id]);

    const fetchData = useCallback(async () => {
        try {
            // Fetch job role details
            const roleResponse = await fetch(`/api/v1/job-roles/${params.id}`);
            if (!roleResponse.ok) throw new Error('Failed to fetch job role');
            const roleResult = await roleResponse.json();
            setJobRole(roleResult.data);

            // Fetch introduction requests (applicants)
            const applicantsResponse = await fetch(`/api/v1/job-roles/${params.id}/applicants`);
            if (!applicantsResponse.ok) throw new Error('Failed to fetch applicants');
            const applicantsResult = await applicantsResponse.json();
            setApplicants(applicantsResult.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load applicants');
        } finally {
            setIsLoading(false);
        }
    }, [params.id]);

    const updateApplicantStatus = async (applicantId: string, status: 'ACCEPTED' | 'REJECTED') => {
        if (updatingIds.has(applicantId)) return;

        setUpdatingIds(prev => new Set(prev).add(applicantId));
        try {
            const response = await fetch(`/api/v1/introduction-requests/${applicantId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Update local state
            setApplicants(prev => prev.map(applicant =>
                applicant.id === applicantId
                    ? { ...applicant, status }
                    : applicant
            ));

            toast.success(`Applicant ${status.toLowerCase()}`);
        } catch (error) {
            console.error('Error updating applicant status:', error);
            toast.error('Failed to update applicant status');
        } finally {
            setUpdatingIds(prev => {
                const next = new Set(prev);
                next.delete(applicantId);
                return next;
            });
        }
    };

    // const updateApplicantStatus = async (applicantId: string, status: 'ACCEPTED' | 'REJECTED') => {
    //     try {
    //         const response = await fetch(`/api/v1/introduction-requests/${applicantId}/status`, {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ status }),
    //         });

    //         if (!response.ok) throw new Error('Failed to update status');

    //         // Update local state
    //         setApplicants(prev => prev.map(applicant =>
    //             applicant.id === applicantId
    //                 ? { ...applicant, status }
    //                 : applicant
    //         ));

    //         toast.success(`Applicant ${status.toLowerCase()}`);
    //     } catch (error) {
    //         console.error('Error updating applicant status:', error);
    //         toast.error('Failed to update applicant status');
    //     }
    // };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'PENDING': return 'secondary';
            case 'ACCEPTED': return 'default';
            case 'REJECTED': return 'destructive';
            case 'WITHDRAWN': return 'outline';
            default: return 'secondary';
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!jobRole) {
        return (
            <div className="container mx-auto py-6">
                <div className="text-center">
                    <p className="text-muted-foreground">Job role not found</p>
                    <Button onClick={() => router.back()} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Role
                </Button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{jobRole.roleTitle}</h1>
                        <p className="text-muted-foreground">
                            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(jobRole.status)}>
                        {jobRole.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4">
                {applicants.length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center">
                                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No applicants yet</h3>
                                <p className="text-muted-foreground">
                                    When professionals apply for this role, their applications will appear here.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    applicants.map((applicant) => (
                        <Card key={applicant.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={applicant.professional.profilePicture} />
                                        <AvatarFallback>
                                            {((applicant.professional.firstName?.[0] || '') + (applicant.professional.lastName?.[0] || '')).trim() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {applicant.professional.firstName} {applicant.professional.lastName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant.professional.currentTitle}
                                                    {applicant.professional.currentCompany && ` at ${applicant.professional.currentCompany}`}
                                                </p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(applicant.status)}>
                                                {applicant.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span>{applicant.professional.email}</span>
                                            </div>
                                            {applicant.professional.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <span>{applicant.professional.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>Applied {new Date(applicant.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {applicant.introductionMessage && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">Introduction Message</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                                                    {applicant.introductionMessage}
                                                </p>
                                            </div>
                                        )}

                                        {applicant.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateApplicantStatus(applicant.id, 'ACCEPTED')}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateApplicantStatus(applicant.id, 'REJECTED')}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
