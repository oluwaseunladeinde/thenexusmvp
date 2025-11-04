'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    MapPin,
    DollarSign,
    Clock,
    Eye,
    CheckCircle,
    XCircle,
    MessageCircle,
    Calendar,
    Building,
    Briefcase,
    Star,
    Shield,
    AlertCircle,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
    introduction: {
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
    };
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onViewDetails: (id: string) => void;
    onContinueConversation?: (id: string) => void;
    className?: string;
}

export function JobCard({
    introduction,
    onAccept,
    onDecline,
    onViewDetails,
    onContinueConversation,
    className = ''
}: JobCardProps) {
    const now = new Date();
    const expiryDate = new Date(introduction.expiresAt);
    const isExpired = introduction.status === 'PENDING' && now > expiryDate;
    const isPending = introduction.status === 'PENDING' && !isExpired;
    const isConfidential = introduction.company.id === 'confidential';
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiring = daysUntilExpiry <= 2 && isPending;

    const getStatusBadge = () => {
        const StatusIcon = getStatusIcon();
        if (isExpired) {
            return <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Expired
            </Badge>;
        }

        switch (introduction.status) {
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                </Badge>;
            case 'ACCEPTED':
                return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Accepted
                </Badge>;
            case 'DECLINED':
                return <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Declined
                </Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{introduction.status}</Badge>;
        }
    };

    const getStatusIcon = () => {
        if (isExpired) return AlertCircle;

        switch (introduction.status) {
            case 'PENDING':
                return Clock;
            case 'ACCEPTED':
                return CheckCircle;
            case 'DECLINED':
                return XCircle;
            default:
                return Clock;
        }
    };

    const getMatchBadge = () => {
        const score = introduction.matchScore || 85;
        return (
            <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 font-semibold">
                <Star className="w-3 h-3" />
                {score}% Match
            </Badge>
        );
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

    const getCompanyInitials = () => {
        if (isConfidential) return '?';
        return introduction.company.companyName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    return (
        <Card className={`rounded-sm p-2 transition-all hover:shadow-lg hover:border-primary/20 ${isExpired ? 'border-gray-200 opacity-60' : 'border-gray-200'
            } ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shrink-0 ${isExpired ? 'bg-gray-400' : 'bg-[#3ABF7A]/10 text-primary'
                        }`}>
                        {getCompanyInitials()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-secondary">
                                        {introduction.jobRole.roleTitle}
                                    </h3>
                                    {!isConfidential && (
                                        <Shield className="w-5 h-5 text-blue-600" />
                                    )}
                                    {!introduction.viewedByProfessional && isPending && (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                                            NEW
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Building className="w-4 h-4" />
                                    <span className="font-semibold">{introduction.company.companyName}</span>
                                    <span>•</span>
                                    <span className="text-sm">{introduction.company.industry}</span>
                                    <span>•</span>
                                    {getStatusBadge()}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">

                                {getMatchBadge()}
                            </div>
                        </div>

                        {/* Personalized Message Preview */}
                        {introduction.personalizedMessage && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                    <span className="font-semibold text-blue-900">
                                        Message from {introduction.sentBy.firstName} {introduction.sentBy.lastName}:
                                    </span>
                                    {' '}{introduction.personalizedMessage}
                                </p>
                            </div>
                        )}

                        {/* Job Details */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">
                                    {formatSalary(introduction.jobRole.salaryRangeMin, introduction.jobRole.salaryRangeMax)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {introduction.jobRole.locationCity}
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                {introduction.jobRole.employmentType.replace('_', ' ')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Sent {formatDate(introduction.sentAt)}
                            </div>
                        </div>

                        {/* Expiry Warning */}
                        {isExpiring && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-orange-800">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold text-sm">
                                        Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {isExpired && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold text-sm">
                                        Expired on {new Date(introduction.expiresAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {isPending && (
                                <div className="flex items-center justify-between gap-3 w-full">
                                    <Button
                                        variant="outline"
                                        onClick={() => onViewDetails(introduction.id)}
                                        className="px-5 py-2 border border-primary text-gray-700 rounded-sm font-semibold hover:bg-[#3ABF7A]/10 hover:text-primary transition cursor-pointer"
                                    >
                                        Details
                                    </Button>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => onAccept(introduction.id)}
                                            className="px-5 py-2 rounded-sm font-semibold bg-[#1F5F3F] transition text-white hover:bg-transparent hover:text-gray-600"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => onDecline(introduction.id)}
                                            className="px-5 py-2 text-gray-600 font-semibold rounded-sm hover:border-accent hover:text-secondary"
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            Decline
                                        </Button>
                                    </div>


                                </div>
                            )}
                            {introduction.status === 'ACCEPTED' && onContinueConversation && (
                                <Button
                                    onClick={() => onContinueConversation(introduction.id)}
                                    className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-[#1F5F3F] transition"
                                >
                                    Continue Conversation
                                </Button>
                            )}
                            {(introduction.status === 'DECLINED' || isExpired) && (
                                <Button
                                    variant="outline"
                                    onClick={() => onViewDetails(introduction.id)}
                                    className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition"
                                >
                                    View Details
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
