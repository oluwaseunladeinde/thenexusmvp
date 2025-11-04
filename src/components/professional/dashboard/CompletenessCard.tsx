

import Link from 'next/link'
import React from 'react'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'

interface CompletenessCardProps {
    profileCompleteness: number;
    completenessBreakdown?: {
        overall: number;
        categories: {
            basicInfo: { score: number; weight: number; completed: number; total: number };
            professionalDetails: { score: number; weight: number; completed: number; total: number };
            verification: { score: number; weight: number; completed: number; total: number };
            documents: { score: number; weight: number; completed: number; total: number };
            networkAndSkills: { score: number; weight: number; completed: number; total: number };
            additional: { score: number; weight: number; completed: number; total: number };
        };
    };
}

const CompletenessCard = ({ profileCompleteness, completenessBreakdown }: CompletenessCardProps) => {
    const getStatusIcon = (completed: number, total: number) => {
        if (completed === total) return <CheckCircle className="w-4 h-4 text-green-500" />;
        if (completed > 0) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        return <Circle className="w-4 h-4 text-gray-400" />;
    };

    const getStatusColor = (completed: number, total: number) => {
        if (completed === total) return 'text-green-600';
        if (completed > 0) return 'text-yellow-600';
        return 'text-gray-500';
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#0D1B2A]">Complete your profile</h3>
                <span className="text-sm text-primary font-medium">{profileCompleteness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompleteness}%` }}
                ></div>
            </div>

            {completenessBreakdown && (
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 p-2 mb-0">
                        <div className='flex items-center justify-center gap-2'>
                            {getStatusIcon(completenessBreakdown.categories.basicInfo.completed, completenessBreakdown.categories.basicInfo.total)}
                            <span className={getStatusColor(completenessBreakdown.categories.basicInfo.completed, completenessBreakdown.categories.basicInfo.total)}>
                                Basic Info ({completenessBreakdown.categories.basicInfo.completed}/{completenessBreakdown.categories.basicInfo.total})
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">{completenessBreakdown.categories.basicInfo.score}%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 p-2 mb-0">
                        <div className='flex items-center justify-center gap-2'>
                            {getStatusIcon(completenessBreakdown.categories.professionalDetails.completed, completenessBreakdown.categories.professionalDetails.total)}
                            <span className={getStatusColor(completenessBreakdown.categories.professionalDetails.completed, completenessBreakdown.categories.professionalDetails.total)}>
                                Professional Details ({completenessBreakdown.categories.professionalDetails.completed}/{completenessBreakdown.categories.professionalDetails.total})
                            </span>
                        </div>
                        <span className="text-gray-500">{completenessBreakdown.categories.professionalDetails.score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 p-2 mb-0">
                        <div className='flex items-center justify-center gap-2'>
                            {getStatusIcon(completenessBreakdown.categories.verification.completed, completenessBreakdown.categories.verification.total)}
                            <span className={getStatusColor(completenessBreakdown.categories.verification.completed, completenessBreakdown.categories.verification.total)}>
                                Verification ({completenessBreakdown.categories.verification.completed}/{completenessBreakdown.categories.verification.total})
                            </span>
                        </div>
                        <span className="text-gray-500">{completenessBreakdown.categories.verification.score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 p-2 mb-0">
                        <div className='flex items-center justify-center gap-2'>
                            {getStatusIcon(completenessBreakdown.categories.documents.completed, completenessBreakdown.categories.documents.total)}
                            <span className={getStatusColor(completenessBreakdown.categories.documents.completed, completenessBreakdown.categories.documents.total)}>
                                Documents ({completenessBreakdown.categories.documents.completed}/{completenessBreakdown.categories.documents.total})
                            </span>
                        </div>
                        <span className="text-gray-500">{completenessBreakdown.categories.documents.score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 p-2 mb-0">
                        <div className='flex items-center justify-center gap-2'>
                            {getStatusIcon(completenessBreakdown.categories.networkAndSkills.completed, completenessBreakdown.categories.networkAndSkills.total)}
                            <span className={getStatusColor(completenessBreakdown.categories.networkAndSkills.completed, completenessBreakdown.categories.networkAndSkills.total)}>
                                Network & Skills ({completenessBreakdown.categories.networkAndSkills.completed}/{completenessBreakdown.categories.networkAndSkills.total})
                            </span>
                        </div>
                        <span className="text-gray-500">{completenessBreakdown.categories.networkAndSkills.score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2">
                        <div className='flex items-center justify-center gap-2'>
                            {getStatusIcon(completenessBreakdown.categories.additional.completed, completenessBreakdown.categories.additional.total)}
                            <span className={getStatusColor(completenessBreakdown.categories.additional.completed, completenessBreakdown.categories.additional.total)}>
                                Additional ({completenessBreakdown.categories.additional.completed}/{completenessBreakdown.categories.additional.total})
                            </span>
                        </div>
                        <span className="text-gray-500">{completenessBreakdown.categories.additional.score}%</span>
                    </div>
                </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
                A complete profile gets 5x more introduction requests
            </p>
            <Link href="/professional/profile" className="px-4 py-2 bg-primary text-white rounded-sm hover:bg-[#1F5F3F] transition text-sm inline-block">
                Complete Profile
            </Link>
        </div>
    )
}

export default CompletenessCard;
