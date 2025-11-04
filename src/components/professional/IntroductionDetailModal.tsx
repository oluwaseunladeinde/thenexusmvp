'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    X, 
    Star, 
    Building, 
    MapPin, 
    DollarSign,
    Clock, 
    Calendar, 
    Briefcase, 
    Users, 
    CheckCircle,
    XCircle, 
    AlertCircle, 
    Mail, 
    Phone, 
    Linkedin,
    Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IntroductionDetailModalProps {
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
    isOpen: boolean;
    onClose: () => void;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onContinueConversation?: (id: string) => void;
}

export function IntroductionDetailModal({
    introduction,
    isOpen,
    onClose,
    onAccept,
    onDecline,
    onContinueConversation
}: IntroductionDetailModalProps) {
    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const [declineReason, setDeclineReason] = useState('');

    if (!isOpen) return null;

    const now = new Date();
    const expiryDate = new Date(introduction.expiresAt);
    const isExpired = introduction.status === 'PENDING' && now > expiryDate;
    const isPending = introduction.status === 'PENDING' && !isExpired;
    const isConfidential = introduction.company.id === 'confidential';
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiring = daysUntilExpiry <= 2 && isPending;

    const getCompanyInitials = () => {
        if (isConfidential) return '?';
        return introduction.company.companyName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
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

    const handleDeclineWithReason = () => {
        onDecline(introduction.id);
        setShowDeclineReason(false);
        setDeclineReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-0 md:p-4">
            {/* Mobile: Full screen, Desktop: Modal */}
            <div className="bg-white w-full h-full md:w-full md:max-w-4xl md:h-auto md:max-h-[90vh] md:rounded-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-[#0A2540]">Introduction Request</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-full md:h-auto md:max-h-[calc(90vh-80px)]">
                    <div className="p-4 md:p-6 space-y-6">
                        {/* Company & Role Header */}
                        <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 ${
                                isExpired ? 'bg-gray-400' : 'bg-gradient-to-br from-[#2E8B57] to-[#3ABF7A]'
                            }`}>
                                {getCompanyInitials()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="text-2xl font-bold text-[#0A2540]">
                                        {introduction.jobRole.roleTitle}
                                    </h3>
                                    {!isConfidential && (
                                        <Shield className="w-5 h-5 text-blue-600" />
                                    )}
                                    {!introduction.viewedByProfessional && isPending && (
                                        <Badge className="bg-red-100 text-red-800 text-xs font-bold">
                                            NEW
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 mb-3">
                                    <Building className="w-4 h-4" />
                                    <span className="font-semibold">{introduction.company.companyName}</span>
                                    <span>•</span>
                                    <span className="text-sm">{introduction.company.industry}</span>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <Badge className={`${
                                        isExpired ? 'bg-gray-100 text-gray-800' :
                                        introduction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        introduction.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    } flex items-center gap-1`}>
                                        {isExpired ? <AlertCircle className="w-3 h-3" /> :
                                         introduction.status === 'PENDING' ? <Clock className="w-3 h-3" /> :
                                         introduction.status === 'ACCEPTED' ? <CheckCircle className="w-3 h-3" /> :
                                         <XCircle className="w-3 h-3" />}
                                        {isExpired ? 'Expired' : introduction.status}
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1 font-semibold">
                                        <Star className="w-3 h-3" />
                                        {introduction.matchScore || 85}% Match
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Expiry Warning */}
                        {isExpiring && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-orange-800">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold">
                                        Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {isExpired && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold">
                                        Expired on {expiryDate.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Personalized Message */}
                        {introduction.personalizedMessage && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                            {introduction.sentBy.firstName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-gray-900">
                                                    {introduction.sentBy.firstName} {introduction.sentBy.lastName}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {introduction.sentBy.jobTitle}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">
                                                "{introduction.personalizedMessage}"
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Job Details */}
                        <Card>
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-4">Job Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Salary Range</p>
                                            <p className="font-semibold">
                                                {formatSalary(introduction.jobRole.salaryRangeMin, introduction.jobRole.salaryRangeMax)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="font-semibold">
                                                {introduction.jobRole.locationCity}, {introduction.jobRole.locationState}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Employment Type</p>
                                            <p className="font-semibold">{introduction.jobRole.employmentType.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Remote Option</p>
                                            <p className="font-semibold">{introduction.jobRole.remoteOption}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Sent</p>
                                            <p className="font-semibold">
                                                {formatDistanceToNow(new Date(introduction.sentAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Seniority Level</p>
                                            <p className="font-semibold">{introduction.jobRole.seniorityLevel.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Info */}
                        <Card>
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-4">Company Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Company Size</p>
                                        <p className="font-semibold">{introduction.company.companySize.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Industry</p>
                                        <p className="font-semibold">{introduction.company.industry}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions - Sticky on mobile */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 md:p-6">
                        {isPending && !showDeclineReason && (
                            <div className="flex flex-col md:flex-row gap-3">
                                <Button 
                                    onClick={() => onAccept(introduction.id)}
                                    className="flex-1 bg-[#2E8B57] hover:bg-[#1F5F3F] text-white py-3"
                                >
                                    Accept Introduction
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => setShowDeclineReason(true)}
                                    className="flex-1 border-2 border-gray-300 py-3"
                                >
                                    Decline
                                </Button>
                            </div>
                        )}

                        {showDeclineReason && (
                            <div className="space-y-3">
                                <textarea
                                    placeholder="Optional: Let them know why you're declining..."
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                    rows={3}
                                />
                                <div className="flex gap-3">
                                    <Button 
                                        onClick={handleDeclineWithReason}
                                        variant="outline"
                                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        Decline Request
                                    </Button>
                                    <Button 
                                        onClick={() => setShowDeclineReason(false)}
                                        variant="ghost"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {introduction.status === 'ACCEPTED' && onContinueConversation && (
                            <Button 
                                onClick={() => onContinueConversation(introduction.id)}
                                className="w-full bg-[#2E8B57] hover:bg-[#1F5F3F] text-white py-3"
                            >
                                Continue Conversation
                            </Button>
                        )}

                        {(introduction.status === 'DECLINED' || isExpired) && (
                            <div className="text-center text-gray-600">
                                <p className="text-sm">
                                    {isExpired ? 'This introduction request has expired' : 'You declined this introduction request'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
