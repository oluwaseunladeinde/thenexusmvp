import { Clock, Eye, MessageSquare, UserCheck, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

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
    activities?: ActivityItem[];
    loading?: boolean;
}

export default function ActivityFeed({ activities = [], loading = false }: ActivityFeedProps) {
    const demoActivities: ActivityItem[] = [
        {
            id: '1',
            type: 'introduction_request',
            title: 'New Introduction Request',
            description: 'TechCorp Nigeria sent you an introduction request for Senior Software Engineer',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            actionUrl: '/professional/introductions',
            isNew: true
        },
        {
            id: '2',
            type: 'profile_view',
            title: 'Profile Viewed',
            description: 'Your profile was viewed by an HR partner',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '3',
            type: 'introduction_request',
            title: 'Introduction Accepted',
            description: 'You accepted the introduction request from PayTech Solutions',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    const displayActivities = activities.length > 0 ? activities : demoActivities;

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

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#0D1B2A]">Recent Activity</h3>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    {displayActivities.slice(0, 4).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                                    {activity.isNew && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">NEW</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/professional/activity" className="text-sm text-[#2E8B57] hover:text-[#1F5F3F] font-medium flex items-center gap-1">
                        View all activity <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
