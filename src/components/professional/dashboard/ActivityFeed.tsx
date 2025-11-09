'use client';

import { Clock, Eye, MessageSquare, UserCheck, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ActivityItem {
    id: string;
    type: 'introduction_request' | 'profile_view' | 'message';
    title: string;
    description: string;
    timestamp: string;
    actionUrl?: string;
    isNew?: boolean;
}

interface ActivityFeedProps {
    loading?: boolean;
}

export default function ActivityFeed({ loading: externalLoading = false }: ActivityFeedProps) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/professionals/me/activity');
            if (response.ok) {
                const data = await response.json();
                setActivities(data.activities || []);
            } else {
                setError('Failed to load activities');
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            setError('Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'introduction_request':
                return <UserCheck className="w-4 h-4 text-[#2E8B57]" />;
            case 'profile_view':
                return <Eye className="w-4 h-4 text-blue-600" />;
            case 'message':
                return <MessageSquare className="w-4 h-4 text-purple-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const isLoading = loading || externalLoading;

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-[#0D1B2A]">Recent Activity</h3>
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#0D1B2A]">Recent Activity</h3>
            </div>
            <div className="p-4">
                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No recent activity</p>
                        <p className="text-gray-500 text-xs mt-1">Activity from the last 7 days will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.slice(0, 4).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm text-gray-900">
                                                    {activity.title}
                                                </p>
                                                {activity.isNew && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                        {activity.actionUrl && (
                                            <Link 
                                                href={activity.actionUrl}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ArrowRight className="w-4 h-4 text-gray-400 hover:text-[#2E8B57]" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {activities.length > 4 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link 
                            href="/professional/activity"
                            className="text-sm text-[#2E8B57] hover:text-[#1F5F3F] font-medium flex items-center gap-1"
                        >
                            View all activity
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
