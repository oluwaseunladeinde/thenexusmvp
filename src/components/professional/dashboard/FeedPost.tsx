"use client";

import { X, MapPin, Briefcase } from 'lucide-react';
import { useState } from 'react';

interface FeedAction {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
}

interface FeedPostProps {
    id: string;
    company: string;
    companyLogo: string;
    title: string;
    subtitle?: string;
    timestamp: string;
    description: string;
    location?: string;
    salary?: string;
    urgent?: boolean;
    urgentLabel?: string;
    actions: FeedAction[];
    onDismiss?: (id: string) => void;
}

export default function FeedPost({
    id,
    company,
    companyLogo,
    title,
    subtitle,
    timestamp,
    description,
    location,
    salary,
    urgent,
    urgentLabel = "Urgent",
    actions,
    onDismiss
}: FeedPostProps) {

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {companyLogo}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[#0D1B2A]">{company}</h4>
                            {urgent && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                    {urgentLabel}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">{timestamp}</p>
                    </div>
                </div>
                {onDismiss && (
                    <button
                        onClick={() => onDismiss(id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Dismiss post"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
                )}
                {(location || salary) && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {location}
                            </div>
                        )}
                        {salary && (
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {salary}
                            </div>
                        )}
                    </div>
                )}
                <p className="text-gray-700 text-sm">
                    {isExpanded ? description : `${description.slice(0, 150)}...`}
                    {description.length > 150 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-primary hover:underline ml-1"
                        >
                            {isExpanded ? 'less' : '...more'}
                        </button>
                    )}
                </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded"
                    >
                        <action.icon className="w-4 h-4" />
                        <span className="text-sm">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
