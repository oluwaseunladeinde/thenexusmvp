"use client";

import { useState, useEffect, useCallback } from 'react';
import { Calendar, TrendingUp, Users, Eye, MessageCircle, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AnalyticsData {
    summary: {
        totalSearches: number;
        totalProfileViews: number;
        totalIntroductions: number;
        acceptedIntroductions: number;
        conversionRates: {
            searchToView: number;
            viewToIntroduction: number;
            introductionToAcceptance: number;
        };
    };
    searchQueries: any[];
    popularQueries: any[];
    filterUsage: any[];
    profileViews: any[];
    timeSeriesData: any;
}

const SearchAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('30d');
    const [groupBy, setGroupBy] = useState('day');


    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                groupBy,
            });

            // Calculate date range
            const endDate = new Date();
            let startDate = new Date();

            switch (timeRange) {
                case '7d':
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case '30d':
                    startDate.setDate(endDate.getDate() - 30);
                    break;
                case '90d':
                    startDate.setDate(endDate.getDate() - 90);
                    break;
                default:
                    startDate.setDate(endDate.getDate() - 30);
            }

            params.set('startDate', startDate.toISOString());
            params.set('endDate', endDate.toISOString());

            const response = await fetch(`/api/v1/analytics/search?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }

            const data = await response.json();
            setAnalytics(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [timeRange, groupBy]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <Card className="p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Analytics</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchAnalytics}>Try Again</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Analytics</h1>
                    <p className="text-gray-600">Insights into your talent search behavior and effectiveness</p>
                </div>

                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={groupBy} onValueChange={setGroupBy}>
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Daily</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                            <SelectItem value="month">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.summary.totalSearches}</div>
                        <p className="text-xs text-muted-foreground">Search queries performed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.summary.totalProfileViews}</div>
                        <p className="text-xs text-muted-foreground">Profiles viewed from search</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Introductions Sent</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.summary.totalIntroductions}</div>
                        <p className="text-xs text-muted-foreground">Introduction requests sent</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(analytics.summary.conversionRates.searchToView ?? 0).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Search to view conversion</p>
                    </CardContent>
                </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Searches</span>
                            <Badge variant="outline">{analytics.summary.totalSearches}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Profile Views</span>
                            <Badge variant="outline">{analytics.summary.totalProfileViews}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Introductions</span>
                            <Badge variant="outline">{analytics.summary.totalIntroductions}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Accepted</span>
                            <Badge variant="outline">{analytics.summary.acceptedIntroductions}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Popular Search Queries */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Search Queries</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.popularQueries.length > 0 ? (
                        <div className="space-y-2">
                            {analytics.popularQueries.map((query: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm">{query.query || 'No query'}</span>
                                    <Badge variant="secondary">{query.count} searches</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No search queries found</p>
                    )}
                </CardContent>
            </Card>

            {/* Recent Search Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Search Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.searchQueries.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.searchQueries.slice(0, 10).map((search: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">
                                            "{search.searchQuery || 'General search'}"
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(search.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {search.resultsCount || 0} results
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recent searches</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchAnalyticsPage;
