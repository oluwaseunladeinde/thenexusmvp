'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    DollarSign,
    Briefcase,
    Calendar,
    Eye,
    MessageSquare,
    ExternalLink,
    Send
} from 'lucide-react';
import { useState } from 'react';
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

interface IntroductionDetailViewProps {
    introduction: IntroductionRequest;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function StartConversationButton({ introductionId }: { introductionId: string }) {
    const [isStarting, setIsStarting] = useState(false);

    const handleStartConversation = async () => {
        const initialMessage = prompt('Enter your initial message to start the conversation:');
        if (!initialMessage || initialMessage.trim().length < 10) {
            toast.error('Please enter a message with at least 10 characters');
            return;
        }

        setIsStarting(true);
        try {
            const response = await fetch('/api/v1/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    introductionRequestId: introductionId,
                    initialMessage: initialMessage.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to start conversation');
            }

            toast.success('Conversation started successfully!');
            // Optionally redirect to conversation page or refresh
        } catch (error) {
            console.error('Error starting conversation:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to start conversation');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <Button onClick={handleStartConversation} disabled={isStarting}>
            {isStarting ? (
                <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Starting...
                </>
            ) : (
                <>
                    <Send className="w-4 h-4 mr-2" />
                    Start Conversation
                </>
            )}
        </Button>
    );
}

export function IntroductionDetailView({
    introduction,
    open,
    onOpenChange
}: IntroductionDetailViewProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'ACCEPTED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'DECLINED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'EXPIRED':
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getStatusIcon(introduction.status)}
                        Introduction Request Details
                        <Badge variant={getStatusBadgeVariant(introduction.status) as any}>
                            {introduction.status.toLowerCase()}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={introduction.professional.profilePhotoUrl} />
                                    <AvatarFallback>
                                        {introduction.professional.firstName[0]}{introduction.professional.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {introduction.professional.firstName} {introduction.professional.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {introduction.professional.currentTitle}
                                    </p>
                                </div>
                                {introduction.professional.linkedinUrl && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="ml-auto"
                                    >
                                        <a
                                            href={introduction.professional.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            LinkedIn
                                        </a>
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">
                                        {introduction.professional.locationCity}, {introduction.professional.locationState}
                                    </span>
                                </div>
                                {introduction.professional.profileHeadline && (
                                    <div className="flex items-start gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <span className="text-sm">{introduction.professional.profileHeadline}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Role Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Job Role Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-lg">{introduction.jobRole.roleTitle}</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    {introduction.jobRole.seniorityLevel} • {introduction.jobRole.employmentType} • {introduction.jobRole.remoteOption}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">
                                        {introduction.jobRole.locationCity}, {introduction.jobRole.locationState}
                                    </span>
                                </div>
                                {(introduction.jobRole.salaryRangeMin || introduction.jobRole.salaryRangeMax) && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">
                                            {introduction.jobRole.salaryRangeMin && introduction.jobRole.salaryRangeMax
                                                ? `${formatCurrency(introduction.jobRole.salaryRangeMin)} - ${formatCurrency(introduction.jobRole.salaryRangeMax)}`
                                                : introduction.jobRole.salaryRangeMin
                                                    ? `From ${formatCurrency(introduction.jobRole.salaryRangeMin)}`
                                                    : `Up to ${formatCurrency(introduction.jobRole.salaryRangeMax!)}`
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div>
                                <h5 className="font-medium mb-2">Role Description</h5>
                                <p className="text-sm text-gray-700">{introduction.jobRole.roleDescription}</p>
                            </div>

                            <div>
                                <h5 className="font-medium mb-2">Requirements</h5>
                                <p className="text-sm text-gray-700">{introduction.jobRole.requirements}</p>
                            </div>

                            {introduction.jobRole.responsibilities && (
                                <div>
                                    <h5 className="font-medium mb-2">Responsibilities</h5>
                                    <p className="text-sm text-gray-700">{introduction.jobRole.responsibilities}</p>
                                </div>
                            )}

                            {introduction.jobRole.benefits && (
                                <div>
                                    <h5 className="font-medium mb-2">Benefits</h5>
                                    <p className="text-sm text-gray-700">{introduction.jobRole.benefits}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Request Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Request Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium">Request Sent</p>
                                        <p className="text-sm text-gray-600">{formatDate(introduction.sentAt)}</p>
                                    </div>
                                </div>

                                {introduction.viewedByProfessional && introduction.viewedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Viewed by Professional
                                            </p>
                                            <p className="text-sm text-gray-600">{formatDate(introduction.viewedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {introduction.responseDate && (
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${introduction.status === 'ACCEPTED' ? 'bg-green-500' :
                                            introduction.status === 'DECLINED' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}></div>
                                        <div>
                                            <p className="font-medium">
                                                Response Received ({introduction.status.toLowerCase()})
                                            </p>
                                            <p className="text-sm text-gray-600">{formatDate(introduction.responseDate)}</p>
                                        </div>
                                    </div>
                                )}

                                {introduction.status === 'PENDING' && new Date() > new Date(introduction.expiresAt) && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-gray-500">Request Expired</p>
                                            <p className="text-sm text-gray-600">{formatDate(introduction.expiresAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Your Message */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Your Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {introduction.personalizedMessage}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Professional Response */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Professional Response
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {introduction.professionalResponse ? (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {introduction.professionalResponse}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        {introduction.status === 'PENDING'
                                            ? 'Waiting for response...'
                                            : 'No response provided'}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                        {introduction.status === 'ACCEPTED' && (
                            <StartConversationButton introductionId={introduction.id} />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
