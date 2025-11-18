import { TrendingUp } from 'lucide-react';
import React from 'react';

const marketInsights = [
    {
        title: "Average Salary for Similar Jobs",
        value: "₦12.5M",
        change: "+8% YoY",
        trend: "up",
    },
    {
        title: "Open Roles",
        value: "247",
        change: "+15% this month",
        trend: "up",
    },
    {
        title: "Your Profile Rank",
        value: "Top 10%",
        change: "in your field",
        trend: "neutral",
    },
];

const MarketInsights = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-secondary dark:text-gray-100 mb-4">
                Market Insights
            </h3>
            <div className="space-y-4">
                {marketInsights.map((insight, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-600 pb-4 last:border-0 last:pb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{insight.title}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-secondary dark:text-gray-100">
                                {insight.value}
                            </p>
                            {insight.trend === 'up' && (
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            )}
                        </div>
                        <p className={`text-xs mt-1 ${insight.trend === 'up' ? 'text-green-600' :
                            insight.trend === 'down' ? 'text-red-600' :
                                'text-gray-600 dark:text-gray-400'
                            }`}>
                            {insight.change}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MarketInsights