import { Plus, Search, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const QuickActions = () => {
    const actions = [
        {
            icon: Plus,
            title: 'Post New Job',
            description: 'Create a new job posting',
            href: '/dashboard/hr-partner/roles/new',
            color: 'bg-primary text-white'
        },
        {
            icon: Search,
            title: 'Search Candidates',
            description: 'Browse professional profiles',
            href: '/dashboard/hr-partner/talents',
            color: 'bg-blue-500 text-white'
        },
        {
            icon: Users,
            title: 'Manage Team',
            description: 'Add HR team members',
            href: '/dashboard/hr-partner/team',
            color: 'bg-green-500 text-white'
        },
        {
            icon: BarChart3,
            title: 'View Analytics',
            description: 'Hiring performance metrics',
            href: '/dashboard/hr-partner/analytics',
            color: 'bg-purple-500 text-white'
        }
    ];

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>

            <div className="space-y-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={index}
                            href={action.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition group"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-105 transition`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-foreground group-hover:text-primary transition">
                                    {action.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
