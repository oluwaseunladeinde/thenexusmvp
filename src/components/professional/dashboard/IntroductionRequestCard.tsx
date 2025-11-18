"use client";

import { Button } from '@/components/ui/button';
import { IntroductionRequest, JobRole, Company } from '@prisma/client';
import { Calendar, DollarSign, MapPin, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';

type IntroductionRequestWithRelations = IntroductionRequest & {
    jobRole: JobRole;
    company: Company;
};

interface IntroductionRequestCardProps {
    request: IntroductionRequestWithRelations;
}

const IntroductionRequestCard = ({ request }: IntroductionRequestCardProps) => {
    const [selectedRequest, setSelectedRequest] = useState<IntroductionRequestWithRelations | null>(null);

    const formatSalary = (min: number | null, max: number | null) => {
        if (!min || !max) return 'Salary not specified';
        return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
    };

    console.log({ request });

    const getDaysAgo = (date: Date | string | null | undefined) => {
        if (!date) {
            return 'Unknown';
        }

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            return 'Unknown';
        }

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - dateObj.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    return (
        <div
            key={request.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-5 hover:border-primary dark:hover:border-primary hover:shadow-md dark:hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800 mb-4"
            onClick={() => setSelectedRequest(request)}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-[#3ABF7A] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {request.company?.companyLogoUrl ? (
                        <img src={request.company.companyLogoUrl} alt={request.company.companyName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        request.company?.companyName?.charAt(0).toUpperCase() || 'C'
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                {request.jobRole?.roleTitle || 'Role Title'}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {request.company?.companyName || 'Company Name'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            <Star className="w-3 h-3" />
                            100% Match
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                        {request.jobRole?.roleDescription || 'No description available'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatSalary(request.jobRole?.salaryRangeMin, request.jobRole?.salaryRangeMax)}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.company?.headquartersLocation || 'Location not specified'}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {getDaysAgo(request?.createdAt)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 justify-between w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-6 mt-4">
                            <Button
                                className="flex items-center justify-center hover:border hover:border-primary dark:hover:border-primary rounded-sm px-2 py-1 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => {
                                    // Handle accept button click
                                }}
                                aria-label="Accept introduction request">
                                <ThumbsUp className="w-4 h-4 text-primary mr-2" />
                                Accept
                            </Button>
                            <Button
                                className="flex items-center justify-center hover:border hover:border-red-400 dark:hover:border-red-400 rounded-sm px-2 py-1 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => {/* TODO: Implement reject handler */ }}
                                aria-label="Reject introduction request"
                            >
                                <ThumbsDown className="w-4 h-4 text-red-600 mr-2" />
                                Reject
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroductionRequestCard;
