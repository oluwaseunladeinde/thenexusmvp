import { Plus, Search, Users, BarChart3, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
    introductionCredits?: number;
}

const QuickActions = ({ introductionCredits = 0 }: QuickActionsProps) => {
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
        },
        {
            icon: Users,
            title: 'View Saved Professionals',
            description: 'See your saved professionals',
            href: '/dashboard/hr-partner/saved',
            color: 'bg-indigo-500 text-white'
        }
    ];

    // Condition to show "Buy Credits" button: e.g. show if introductionCredits < 10
    const showBuyCredits = introductionCredits < 10;

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

                {showBuyCredits && (
                    <Link
                        href="/dashboard/hr-partner/buy-credits"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition group"
                    >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500 text-white group-hover:scale-105 transition">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition">
                                Buy Credits
                            </h4>
                            <p className="text-sm text-muted-foreground">Purchase introduction credits</p>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default QuickActions;
