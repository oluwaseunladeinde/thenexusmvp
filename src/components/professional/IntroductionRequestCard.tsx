'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Building2,
    MapPin,
    Clock,
    DollarSign,
    Eye,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IntroductionRequestCardProps {
    introduction: {
        id: string;
        status: string;
        personalizedMessage?: string;
        sentAt: string;
        expiresAt: string;
        viewedByProfessional: boolean;
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
    };
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onViewDetails: (id: string) => void;
    className?: string;
}

export function IntroductionRequestCard({
    introduction,
    onAccept,
    onDecline,
    onViewDetails,
    className = ''
}: IntroductionRequestCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isExpired = new Date() > new Date(introduction.expiresAt);
    const isPending = introduction.status === 'PENDING' && !isExpired;
    const isConfidential = introduction.company.id === 'confidential';

    const getStatusBadge = () => {
        switch (introduction.status) {
            case 'PENDING':
                return isExpired ?
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">Expired</Badge> :
                    <Badge variant="default" className="bg-blue-100 text-blue-700">Pending</Badge>;
            case 'ACCEPTED':
                return <Badge variant="default" className="bg-green-100 text-green-700">Accepted</Badge>;
            case 'DECLINED':
                return <Badge variant="default" className="bg-red-100 text-red-700">Declined</Badge>;
            default:
                return <Badge variant="secondary">{introduction.status}</Badge>;
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

    return (
        <Card className={`transition-all hover:shadow-md ${isExpired ? 'opacity-75' : ''} ${className}`}>
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={introduction.company.companyLogoUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {isConfidential ? '?' : introduction.company.companyName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                                {introduction.jobRole.roleTitle}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {introduction.company.companyName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!introduction.viewedByProfessional && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{introduction.jobRole.locationCity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(introduction.jobRole.salaryRangeMin, introduction.jobRole.salaryRangeMax)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{introduction.jobRole.remoteOption}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(introduction.sentAt), { addSuffix: true })}</span>
                    </div>
                </div>

                {/* Message Preview */}
                {introduction.personalizedMessage && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">
                            "{introduction.personalizedMessage}"
                        </p>
                    </div>
                )}

                {/* HR Contact */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={introduction.sentBy.profilePhotoUrl} />
                        <AvatarFallback className="text-xs">
                            {introduction.sentBy.firstName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span>
                        {introduction.sentBy.firstName} {introduction.sentBy.lastName} • {introduction.sentBy.jobTitle}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(introduction.id)}
                        className="flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </Button>

                    {isPending && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDecline(introduction.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => onAccept(introduction.id)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                            </Button>
                        </div>
                    )}
                </div>

                {/* Expiration Warning */}
                {isPending && new Date(introduction.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000 && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        ⚠️ This request expires in {formatDistanceToNow(new Date(introduction.expiresAt))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
