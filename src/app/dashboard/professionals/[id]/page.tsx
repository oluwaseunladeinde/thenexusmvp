"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    Star,
    MessageCircle,
    Bookmark,
    ExternalLink,
    Mail,
    Calendar,
    Clock,
    Award,
    GraduationCap,
    Building,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Professional {
    id: string;
    name: string;
    profileHeadline?: string;
    profileSummary?: string;
    profilePhotoUrl?: string;
    yearsOfExperience: number;
    currentTitle?: string;
    currentCompany?: string;
    currentIndustry?: string;
    location: string;
    willingToRelocate: boolean;
    salaryRange?: string;
    noticePeriodDays: number;
    verificationStatus: string;
    isVerified: boolean;
    linkedinUrl?: string;
    portfolioUrl?: string;
    email?: string;
    workHistory: any[];
    education: any[];
    skills: any[];
    certifications: any[];
    hasActiveIntroduction: boolean;
    introductionStatus?: string;
    canRequestIntroduction: boolean;
    canViewContactInfo: boolean;
}

const ProfessionalProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const professionalId = params.id as string;

    useEffect(() => {
        fetchProfessional();
        trackProfileView();
    }, [professionalId]);

    const trackProfileView = async () => {
        try {
            await fetch('/api/v1/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'PROFILE_VIEW',
                    data: {
                        professionalId,
                        source: 'direct_access',
                        timestamp: new Date().toISOString(),
                    },
                }),
            });
        } catch (error) {
            console.error('Failed to track profile view:', error);
        }
    };

    const fetchProfessional = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v1/professionals/${professionalId}`);

            if (!response.ok) {
                throw new Error('Failed to load professional profile');
            }

            const data = await response.json();
            setProfessional(data.professional);
        } catch (err) {
            setError('Failed to load professional profile');
            toast.error('Failed to load professional profile');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestIntroduction = async () => {
        setActionLoading('introduction');
        // TODO: Implement introduction request
        setTimeout(() => {
            setActionLoading(null);
            toast.success('Your introduction request has been sent');
        }, 1000);
    };

    const handleSaveProfile = async () => {
        setActionLoading('save');
        try {
            const response = await fetch(`/api/v1/professionals/${professionalId}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save professional');
            }

            toast.success('Professional has been saved to your list');
        } catch (err: any) {
            console.error('Save professional error:', err);
            toast.error(err.message || 'Failed to save professional');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error || !professional) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card className="p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
                    <p className="text-gray-600 mb-4">The professional profile you're looking for doesn't exist or isn't accessible.</p>
                    <Button onClick={() => router.back()} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </Card>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Search
                </Button>
            </div>

            {/* Profile Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <Avatar className="h-24 w-24 mx-auto md:mx-0">
                            <AvatarImage src={professional.profilePhotoUrl} />
                            <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                                {getInitials(professional.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {professional.name}
                                        {professional.isVerified && (
                                            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                                                <Star className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </h1>
                                    {professional.profileHeadline && (
                                        <p className="text-lg text-gray-600 mb-2">{professional.profileHeadline}</p>
                                    )}
                                    {professional.currentTitle && (
                                        <p className="text-gray-600">
                                            {professional.currentTitle}
                                            {professional.currentCompany && ` at ${professional.currentCompany}`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {professional.location}
                                    {professional.willingToRelocate && (
                                        <Badge variant="outline" className="ml-1 text-xs">Open to relocate</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    {professional.yearsOfExperience} years experience
                                </div>
                                {professional.salaryRange && (
                                    <div className="flex items-center gap-1 font-medium text-green-600">
                                        {professional.salaryRange}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {professional.canRequestIntroduction && (
                                    <Button
                                        onClick={handleRequestIntroduction}
                                        disabled={actionLoading === 'introduction'}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {actionLoading === 'introduction' ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Request Introduction
                                    </Button>
                                )}

                                {professional.hasActiveIntroduction && (
                                    <Badge variant="outline" className="px-4 py-2">
                                        Introduction {professional.introductionStatus?.toLowerCase()}
                                    </Badge>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={handleSaveProfile}
                                    disabled={actionLoading === 'save'}
                                >
                                    {actionLoading === 'save' ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Bookmark className="h-4 w-4 mr-2" />
                                    )}
                                    Save Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Summary */}
            {professional.profileSummary && (
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 leading-relaxed">{professional.profileSummary}</p>
                    </CardContent>
                </Card>
            )}

            {/* Skills */}
            {professional.skills.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {professional.skills.map((skill: any) => (
                                <Badge key={skill.id} variant="outline" className="px-3 py-1">
                                    {skill.skillName}
                                    {skill.yearsOfExperience && (
                                        <span className="ml-1 text-xs text-gray-500">
                                            ({skill.yearsOfExperience}y)
                                        </span>
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Work History */}
            {professional.workHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Work Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {professional.workHistory.map((work: any, index: number) => (
                            <div key={work.id}>
                                <div className="flex items-start gap-3">
                                    <Building className="h-5 w-5 text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{work.jobTitle}</h3>
                                        <p className="text-gray-600">{work.company}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(work.startDate).toLocaleDateString()} -
                                            {work.isCurrent ? ' Present' : work.endDate ? ` ${new Date(work.endDate).toLocaleDateString()}` : ' N/A'}
                                            {work.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{work.location}</span>
                                                </>
                                            )}
                                        </div>
                                        {work.description && (
                                            <p className="text-gray-700 mt-2 leading-relaxed">{work.description}</p>
                                        )}
                                    </div>
                                </div>
                                {index < professional.workHistory.length - 1 && <Separator className="mt-6" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Education */}
            {professional.education.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {professional.education.map((edu: any, index: number) => (
                            <div key={edu.id}>
                                <div className="flex items-start gap-3">
                                    <GraduationCap className="h-5 w-5 text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                        <p className="text-gray-600">{edu.institution}</p>
                                        {edu.fieldOfStudy && (
                                            <p className="text-gray-600">{edu.fieldOfStudy}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Calendar className="h-4 w-4" />
                                            {edu.startDate ? new Date(edu.startDate).getFullYear() : 'N/A'} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'N/A'}
                                            {edu.grade && (
                                                <>
                                                    <span>•</span>
                                                    <span>{edu.grade}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {index < professional.education.length - 1 && <Separator className="mt-6" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Certifications */}
            {professional.certifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Certifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {professional.certifications.map((cert: any) => (
                            <div key={cert.id} className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-gray-400 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                                    <p className="text-gray-600">{cert.issuingOrganization}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        Obtained: {cert.dateObtained ? new Date(cert.dateObtained).toLocaleDateString() : 'N/A'}
                                        {cert.expiryDate && (
                                            <>
                                                <span>•</span>
                                                <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                                            </>
                                        )}
                                    </div>
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm mt-1"
                                        >
                                            View Credential <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Contact & Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                Notice Period: {professional.noticePeriodDays} days
                            </span>
                        </div>

                        {professional.canViewContactInfo && professional.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <a href={`mailto:${professional.email}`} className="text-sm text-green-600 hover:text-green-700">
                                    {professional.email}
                                </a>
                            </div>
                        )}
                    </div>

                    {professional.canViewContactInfo && (professional.linkedinUrl || professional.portfolioUrl) && (
                        <div className="flex flex-wrap gap-3 pt-2">
                            {professional.linkedinUrl && (
                                <a
                                    href={professional.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    LinkedIn Profile <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                            {professional.portfolioUrl && (
                                <a
                                    href={professional.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                                >
                                    Portfolio <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    )}

                    {!professional.canViewContactInfo && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-sm text-amber-700">
                                Contact information will be available after the professional accepts your introduction request.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfessionalProfilePage;
