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

    const formatSalary = (min: number, max: number) => `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;

    const getDaysAgo = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    return (
        <div
            key={request.id}
            className="border border-gray-200 rounded-sm p-5 hover:border-primary hover:shadow-md transition cursor-pointer mb-4"
            onClick={() => setSelectedRequest(request)}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-[#3ABF7A] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {request.company.companyLogoUrl ? (
                        <img src={request.company.companyLogoUrl} alt={request.company.companyName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        request.company.companyName.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h4 className="font-bold text-secondary text-lg">
                                {request.jobRole.roleTitle}
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {request.company.companyName}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            <Star className="w-3 h-3" />
                            100% Match
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">
                        {request.jobRole.roleDescription}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatSalary(request.jobRole.salaryRangeMin, request.jobRole.salaryRangeMax)}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.company.headquartersLocation}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {getDaysAgo(request.createdAt)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 justify-between w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-6 mt-4">
                            <Button
                                className="flex items-center justify-center hover:border hover:border-primary rounded-sm px-2 py-1"
                                onClick={() => {
                                    // Handle accept button click
                                }}
                                aria-label="Accept introduction request">
                                <ThumbsUp className="w-4 h-4 text-primary mr-2" />
                                Accept
                            </Button>
                            <Button
                                className="flex items-center justify-center hover:border hover:border-red-400 rounded-sm px-2 py-1"
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
