import { TrendingUp, Clock, Target } from 'lucide-react';

const HiringInsights = () => {
    const insights = [
        {
            icon: TrendingUp,
            title: 'Hiring Velocity',
            value: '18 days',
            description: 'Average time to hire',
            trend: '+2 days vs last month',
            trendType: 'negative' as const
        },
        {
            icon: Target,
            title: 'Success Rate',
            value: '78%',
            description: 'Offer acceptance rate',
            trend: '+5% vs last month',
            trendType: 'positive' as const
        },
        {
            icon: Clock,
            title: 'Pipeline Health',
            value: '24',
            description: 'Active candidates',
            trend: '+8 this week',
            trendType: 'positive' as const
        }
    ];

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Hiring Insights</h3>
            
            <div className="space-y-4">
                {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-medium text-foreground">{insight.title}</h4>
                                    <span className="text-lg font-bold text-foreground">{insight.value}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{insight.description}</p>
                                <p className={`text-xs ${
                                    insight.trendType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {insight.trend}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Tip of the Day</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Candidates with complete profiles are 3x more likely to respond to introductions. 
                        Focus on verified professionals for better results.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HiringInsights;
