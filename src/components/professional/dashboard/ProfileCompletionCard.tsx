'use client';

import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
    completeness: number;
    professionalId: string;
}

const completionSteps = [
    { id: 'photo', label: 'Add profile photo', href: '/professional/profile/edit' },
    { id: 'summary', label: 'Write professional summary', href: '/professional/profile/edit' },
    { id: 'experience', label: 'Add work experience', href: '/professional/experience' },
    { id: 'education', label: 'Add education', href: '/professional/education' },
    { id: 'skills', label: 'Add skills (5+)', href: '/professional/skills' },
    { id: 'resume', label: 'Upload CV/Resume', href: '/professional/profile/edit' },
];

export default function ProfileCompletionCard({ completeness, professionalId }: Props) {
    const remainingSteps = completionSteps.filter((_, index) => index < 6 - Math.floor(completeness / 16.67));

    if (completeness === 100) {
        return (
            <div className="bg-linear-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-bold text-green-900">Profile Complete!</h3>
                </div>
                <p className="text-sm text-green-800">
                    Your profile is fully optimized. You'll receive the best introduction opportunities.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-secondary">Complete Your Profile</h3>
                    <span className="text-sm font-semibold text-primary">{completeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${completeness}%` }}
                    />
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Complete profiles get <strong className="text-primary">3x more</strong> introduction
                requests
            </p>

            <div className="space-y-3">
                {remainingSteps.slice(0, 3).map((step) => (
                    <Link
                        key={step.id}
                        href={step.href}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Circle className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                                {step.label}
                            </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                    </Link>
                ))}
            </div>

            {remainingSteps.length > 3 && (
                <Link
                    href="/professional/profile/edit"
                    className="block mt-4 text-center text-sm text-primary font-semibold hover:text-[#1F5F3F]"
                >
                    View all {remainingSteps.length} steps →
                </Link>
            )}
        </div>
    );
}