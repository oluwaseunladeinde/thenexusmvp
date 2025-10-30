import { Eye, Mail, MessageCircle, TrendingUp } from 'lucide-react';

interface Props {
    stats: {
        pendingIntroductions: number;
        acceptedIntroductions: number;
        profileViews: number;
        profileCompleteness: number;
    };
}

export default function StatsOverview({ stats }: Props) {
    const statItems = [
        {
            label: 'Profile Views',
            value: stats.profileViews,
            icon: Eye,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Pending Requests',
            value: stats.pendingIntroductions,
            icon: Mail,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Active Conversations',
            value: stats.acceptedIntroductions,
            icon: MessageCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            label: 'Profile Strength',
            value: `${stats.profileCompleteness}%`,
            icon: TrendingUp,
            color: 'text-[#2E8B57]',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-secondary mb-4">Your Stats</h3>

            <div className="space-y-4">
                {statItems.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-sm text-gray-700">{stat.label}</span>
                        </div>
                        <span className="text-lg font-bold text-secondary">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}