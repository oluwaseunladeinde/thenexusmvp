import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'introduction_sent' | 'introduction_accepted' | 'introduction_declined' | 'saved_professional' | 'profile_view';
    description: string;
    timestamp: string; // ISO string
    href?: string;
}

const RecentActivityFeed = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For demonstration, mock fetch recent activity.
        // Replace with real API integration if available.
        const mockData: ActivityItem[] = [
            {
                id: '1',
                type: 'introduction_sent',
                description: 'Introduction request sent to John Doe',
                timestamp: new Date().toISOString(),
                href: '/dashboard/hr-partner/introductions',
            },
            {
                id: '2',
                type: 'introduction_accepted',
                description: 'Introduction accepted by Jane Smith',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                href: '/dashboard/hr-partner/introductions',
            },
            {
                id: '3',
                type: 'saved_professional',
                description: 'New professional saved: Alan Turing',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
                href: '/dashboard/hr-partner/saved',
            },
            {
                id: '4',
                type: 'profile_view',
                description: 'Profile viewed: Grace Hopper',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                href: '/dashboard/hr-partner/talents',
            },
            {
                id: '5',
                type: 'introduction_declined',
                description: 'Introduction declined by Alan Kay',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                href: '/dashboard/hr-partner/introductions',
            },
        ];

        setActivities(mockData);
        setLoading(false);
    }, []);

    function timeSince(dateString: string) {
        const date = new Date(dateString);
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
        return 'just now';
    }

    if (loading) {
        return <div className="bg-card rounded-lg border border-border p-6">Loading Recent Activity...</div>;
    }

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <ul className="divide-y divide-border max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                    <li key={activity.id} className="py-3">
                        {activity.href ? (
                            <Link href={activity.href} className="text-sm text-primary hover:underline">
                                <div className="flex justify-between items-center">
                                    <span>{activity.description}</span>
                                    <time className="text-muted-foreground flex items-center gap-1" dateTime={activity.timestamp}>
                                        <Clock className="w-3 h-3" />
                                        {timeSince(activity.timestamp)}
                                    </time>
                                </div>
                            </Link>
                        ) : (
                            <div>
                                <span>{activity.description}</span>
                                <time className="text-muted-foreground flex items-center gap-1" dateTime={activity.timestamp}>
                                    <Clock className="w-3 h-3" />
                                    {timeSince(activity.timestamp)}
                                </time>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="pt-4 text-right">
                <Link href="/dashboard/hr-partner/introductions" className="text-sm text-primary hover:underline">
                    View All →
                </Link>
            </div>
        </div>
    );
};

export default RecentActivityFeed;
