'use client';

import { useState } from 'react';
import { Mail, Building2, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface IntroductionRequest {
    id: string;
    personalizedMessage: string;
    sentAt: Date;
    status: string;
    expiresAt: Date;
    jobRole: {
        roleTitle: string;
        salaryRangeMin: number;
        salaryRangeMax: number;
        locationCity: string;
        employmentType: string;
    };
    company: {
        companyName: string;
        companyLogoUrl: string | null;
        industry: string;
    };
    sentBy: {
        firstName: string;
        lastName: string;
        jobTitle: string;
        profilePhotoUrl: string | null;
    };
}

interface Props {
    introductions: IntroductionRequest[];
    professionalName: string;
}

export default function IntroductionRequestsFeed({ introductions, professionalName }: Props) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('pending');

    const filteredIntros =
        filter === 'all'
            ? introductions
            : introductions.filter((i) => i.status.toLowerCase() === filter);

    const formatSalary = (min: number, max: number) => {
        const formatNum = (num: number) => {
            if (num >= 1000000) {
                return `₦${(num / 1000000).toFixed(1)}M`;
            }
            return `₦${(num / 1000).toFixed(0)}K`;
        };
        return `${formatNum(min)} - ${formatNum(max)}`;
    };

    const getTimeLeft = (expiresAt: Date) => {
        const now = new Date();
        const diff = new Date(expiresAt).getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 1) return `${days} days left`;
        if (days === 1) return '1 day left';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        return `${hours} hours left`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-secondary mb-4">Introduction Requests</h2>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    {[
                        { key: 'pending', label: 'Pending', count: introductions.filter((i) => i.status === 'PENDING').length },
                        { key: 'accepted', label: 'Active', count: introductions.filter((i) => i.status === 'ACCEPTED').length },
                        { key: 'all', label: 'All', count: introductions.length },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as any)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filter === tab.key
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-200">
                {filteredIntros.length === 0 ? (
                    <div className="p-12 text-center">
                        <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {filter === 'pending'
                                ? 'No pending requests'
                                : filter === 'accepted'
                                    ? 'No active conversations'
                                    : 'No introduction requests yet'}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {filter === 'pending'
                                ? "You're all caught up! New opportunities will appear here."
                                : 'Complete your profile to start receiving introduction requests from top companies.'}
                        </p>
                    </div>
                ) : (
                    filteredIntros.map((intro) => (
                        <div key={intro.id} className="p-6 hover:bg-gray-50 transition-colors">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Company Logo */}
                                    <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                        {intro.company.companyLogoUrl ? (
                                            <Image
                                                src={intro.company.companyLogoUrl}
                                                alt={intro.company.companyName}
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Job Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-secondary mb-1">
                                            {intro.jobRole.roleTitle}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {intro.company.companyName} · {intro.company.industry}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {intro.jobRole.locationCity}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {formatSalary(
                                                    intro.jobRole.salaryRangeMin,
                                                    intro.jobRole.salaryRangeMax
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {intro.jobRole.employmentType}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                {intro.status === 'PENDING' && (
                                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
                                        {getTimeLeft(intro.expiresAt)}
                                    </span>
                                )}
                                {intro.status === 'ACCEPTED' && (
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                        Active
                                    </span>
                                )}
                            </div>

                            {/* HR Person */}
                            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    {intro.sentBy.profilePhotoUrl ? (
                                        <Image
                                            src={intro.sentBy.profilePhotoUrl}
                                            alt={`${intro.sentBy.firstName} ${intro.sentBy.lastName}`}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-secondary to-[#1A3A52] flex items-center justify-center text-white text-sm font-bold">
                                            {intro.sentBy.firstName[0]}
                                            {intro.sentBy.lastName[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {intro.sentBy.firstName} {intro.sentBy.lastName}
                                    </p>
                                    <p className="text-xs text-gray-600">{intro.sentBy.jobTitle}</p>
                                </div>
                            </div>

                            {/* Message */}
                            {intro.personalizedMessage && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-700 italic">
                                        "{intro.personalizedMessage.substring(0, 150)}
                                        {intro.personalizedMessage.length > 150 ? '...' : ''}"
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {intro.status === 'PENDING' ? (
                                    <>
                                        <Link
                                            href={`/professional/introductions/${intro.id}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-[#1F5F3F] transition-colors"
                                        >
                                            View Details
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <button className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                            Decline
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href={`/professional/conversations/${intro.id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-lg font-semibold hover:bg-[#1A3A52] transition-colors"
                                    >
                                        Open Conversation
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}