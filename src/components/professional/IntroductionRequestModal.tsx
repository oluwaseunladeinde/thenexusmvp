'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
    Building2, 
    MapPin, 
    Clock, 
    DollarSign,
    Users,
    Globe,
    CheckCircle,
    XCircle,
    Calendar,
    Briefcase,
    GraduationCap,
    Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IntroductionRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    introduction: {
        id: string;
        status: string;
        personalizedMessage?: string;
        sentAt: string;
        expiresAt: string;
        professionalResponse?: string;
        responseDate?: string;
        jobRole: {
            id: string;
            roleTitle: string;
            roleDescription: string;
            responsibilities?: string;
            requirements: string;
            preferredQualifications?: string;
            benefits?: string;
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
            headquartersLocation: string;
            companyWebsite?: string;
            companyDescription?: string;
        };
        sentBy: {
            firstName: string;
            lastName: string;
            jobTitle: string;
            profilePhotoUrl?: string;
            linkedinUrl?: string;
        };
    };
    onAccept: (id: string, message?: string) => void;
    onDecline: (id: string, message?: string) => void;
}

export function IntroductionRequestModal({ 
    isOpen, 
    onClose, 
    introduction, 
    onAccept, 
    onDecline 
}: IntroductionRequestModalProps) {
    const [responseMessage, setResponseMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isExpired = new Date() > new Date(introduction.expiresAt);
    const isPending = introduction.status === 'PENDING' && !isExpired;
    const isConfidential = introduction.company.id === 'confidential';

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            await onAccept(introduction.id, responseMessage);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDecline = async () => {
        setIsSubmitting(true);
        try {
            await onDecline(introduction.id, responseMessage);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatSalary = (min: number, max: number) => {
        const formatAmount = (amount: number) => {
            if (amount >= 1000000) {
                return `₦${(amount / 1000000).toFixed(1)}M`;
            }
            return `₦${(amount / 1000).toFixed(0)}K`;
        };
        return `${formatAmount(min)} - ${formatAmount(max)}`;
    };

    const getStatusBadge = () => {
        switch (introduction.status) {
            case 'PENDING':
                return isExpired ? 
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">Expired</Badge> :
                    <Badge variant="default" className="bg-blue-100 text-blue-700">Pending Response</Badge>;
            case 'ACCEPTED':
                return <Badge variant="default" className="bg-green-100 text-green-700">Accepted</Badge>;
            case 'DECLINED':
                return <Badge variant="default" className="bg-red-100 text-red-700">Declined</Badge>;
            default:
                return <Badge variant="secondary">{introduction.status}</Badge>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={introduction.company.companyLogoUrl} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                    {isConfidential ? '?' : introduction.company.companyName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {introduction.jobRole.roleTitle}
                                </DialogTitle>
                                <p className="text-lg text-gray-600 flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    {introduction.company.companyName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {introduction.company.industry} • {introduction.company.companySize}
                                </p>
                            </div>
                        </div>
                        {getStatusBadge()}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">{introduction.jobRole.locationCity}</p>
                                <p className="text-xs text-gray-500">{introduction.jobRole.remoteOption}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">
                                    {formatSalary(introduction.jobRole.salaryRangeMin, introduction.jobRole.salaryRangeMax)}
                                </p>
                                <p className="text-xs text-gray-500">Annual</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">{introduction.jobRole.seniorityLevel}</p>
                                <p className="text-xs text-gray-500">{introduction.jobRole.employmentType}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">
                                    {formatDistanceToNow(new Date(introduction.sentAt), { addSuffix: true })}
                                </p>
                                <p className="text-xs text-gray-500">Received</p>
                            </div>
                        </div>
                    </div>

                    {/* Personalized Message */}
                    {introduction.personalizedMessage && (
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={introduction.sentBy.profilePhotoUrl} />
                                    <AvatarFallback className="text-xs">
                                        {introduction.sentBy.firstName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                Message from {introduction.sentBy.firstName} {introduction.sentBy.lastName}
                            </h3>
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                <p className="text-gray-700">{introduction.personalizedMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Job Description */}
                    <div>
                        <h3 className="font-semibold mb-3">Job Description</h3>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{introduction.jobRole.roleDescription}</p>
                        </div>
                    </div>

                    {/* Responsibilities */}
                    {introduction.jobRole.responsibilities && (
                        <div>
                            <h3 className="font-semibold mb-3">Key Responsibilities</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{introduction.jobRole.responsibilities}</p>
                            </div>
                        </div>
                    )}

                    {/* Requirements */}
                    <div>
                        <h3 className="font-semibold mb-3">Requirements</h3>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{introduction.jobRole.requirements}</p>
                        </div>
                    </div>

                    {/* Preferred Qualifications */}
                    {introduction.jobRole.preferredQualifications && (
                        <div>
                            <h3 className="font-semibold mb-3">Preferred Qualifications</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{introduction.jobRole.preferredQualifications}</p>
                            </div>
                        </div>
                    )}

                    {/* Benefits */}
                    {introduction.jobRole.benefits && (
                        <div>
                            <h3 className="font-semibold mb-3">Benefits & Perks</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{introduction.jobRole.benefits}</p>
                            </div>
                        </div>
                    )}

                    {/* Company Info (if not confidential) */}
                    {!isConfidential && introduction.company.companyDescription && (
                        <div>
                            <h3 className="font-semibold mb-3">About {introduction.company.companyName}</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700">{introduction.company.companyDescription}</p>
                            </div>
                            {introduction.company.companyWebsite && (
                                <div className="mt-2">
                                    <a 
                                        href={introduction.company.companyWebsite} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Company Website
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* HR Contact */}
                    <div>
                        <h3 className="font-semibold mb-3">Your Contact</h3>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={introduction.sentBy.profilePhotoUrl} />
                                <AvatarFallback>
                                    {introduction.sentBy.firstName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium">
                                    {introduction.sentBy.firstName} {introduction.sentBy.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{introduction.sentBy.jobTitle}</p>
                                <p className="text-sm text-gray-600">{introduction.company.companyName}</p>
                            </div>
                            {introduction.sentBy.linkedinUrl && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={introduction.sentBy.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                        View LinkedIn
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Response Section */}
                    {isPending && (
                        <div>
                            <h3 className="font-semibold mb-3">Your Response</h3>
                            <Textarea
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                placeholder="Add an optional message with your response..."
                                rows={4}
                                className="mb-4"
                            />
                            <div className="flex gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={handleDecline}
                                    disabled={isSubmitting}
                                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Decline Opportunity
                                </Button>
                                <Button 
                                    onClick={handleAccept}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Accept & Connect
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Previous Response */}
                    {introduction.professionalResponse && (
                        <div>
                            <h3 className="font-semibold mb-3">Your Response</h3>
                            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                                <p className="text-gray-700">{introduction.professionalResponse}</p>
                                {introduction.responseDate && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Responded {formatDistanceToNow(new Date(introduction.responseDate), { addSuffix: true })}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Expiration Warning */}
                    {isPending && new Date(introduction.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800">
                                <Clock className="w-5 h-5" />
                                <p className="font-medium">
                                    This request expires in {formatDistanceToNow(new Date(introduction.expiresAt))}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
