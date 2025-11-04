"use client";

import ActivitySidebar from "@/components/professional/dashboard/ActivitySidebar";
import CompletenessCard from "@/components/professional/dashboard/CompletenessCard";
import DashboardSkeleton from "@/components/professional/dashboard/DashboardSkeleton";
import EmptyIntroductionRequests from "@/components/professional/dashboard/EmptyIntroductionRequests";
import IntroductionRequestCard from "@/components/professional/dashboard/IntroductionRequestCard";
import MarketInsights from "@/components/professional/dashboard/MarketInsights";
import ProfileCard from "@/components/professional/dashboard/ProfileCard";
import QuickActions from "@/components/professional/dashboard/QuickActions";
import { Clock, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";


interface Stats {
    profileViews: number;
    pending: number;
    accepted: number;
}

interface CompletenessData {
    overall: number;
    // ... breakdown fields
}


const ProfessionalDashboardPage = () => {
    const [profileData, setProfileData] = useState<any>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [completenessData, setCompletenessData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dismissedPosts, setDismissedPosts] = useState<string[]>([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setError(null);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('/api/v1/professionals/me', {
                signal: controller.signal,
            });
            clearTimeout(timeoutId);


            if (response.ok) {
                const data = await response.json();
                setProfileData(data.data.professional);
                setStats(data.data.stats);
                setCompletenessData(data.data.completeness);

                console.log({ profile: data.data.professional });
            } else {
                setError('Failed to load profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error instanceof Error && error.name === 'AbortError') {
                setError('Request timed out. Please try again.');
            } else {
                setError('Failed to load profile data');
            }
        } finally {
            setLoading(false);
        }
    };

    const dismissPost = (postId: string) => {
        setDismissedPosts(prev => [...prev, postId]);
    };

    const suggestions = [
        {
            name: 'Kemi Adebayo',
            headline: 'Senior Data Scientist | AI/ML Expert | Fintech',
            photo: '👩💼',
            mutualConnections: 5
        },
        {
            name: 'Tunde Okafor',
            headline: 'Product Manager | SaaS | Growth Strategy',
            photo: '👨💼',
            mutualConnections: 3
        }
    ];

    const mockIntroductionRequests = [
        {
            id: 1,
            company: "FinanceHub Ltd",
            companyLogo: "FH",
            role: "VP of Strategy",
            salary: "₦12-18M",
            location: "Lagos",
            postedDate: "2 days ago",
            status: "pending",
            matchScore: 95,
            description: "Leading strategy and operations for Nigeria's fastest-growing fintech",
            requirements: ["10+ years experience", "Strategic planning", "Team leadership"],
        },
        {
            id: 2,
            company: "Global Energy Corp",
            companyLogo: "GE",
            role: "Head of Operations",
            salary: "₦15-22M",
            location: "Port Harcourt",
            postedDate: "5 days ago",
            status: "pending",
            matchScore: 88,
            description: "Oversee operations across multiple facilities in the Niger Delta region",
            requirements: ["Oil & Gas experience", "Operations management", "P&L responsibility"],
        },
        {
            id: 3,
            company: "RetailPro Nigeria",
            companyLogo: "RP",
            role: "Director of Operations",
            salary: "₦10-14M",
            location: "Lagos",
            postedDate: "1 week ago",
            status: "pending",
            matchScore: 82,
            description: "Lead operational excellence across 50+ retail locations nationwide",
            requirements: ["Retail experience", "Multi-site management", "Process optimization"],
        },
    ];

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
                <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center max-w-md">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProfileData}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#1F5F3F] transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Real introduction requests from API
    const introductionRequests = profileData?.introductionRequests || [];
    const profileCompleteness = completenessData?.overall || 0;

    console.log({ profileCompleteness });

    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <ProfileCard
                            profileData={profileData}
                            stats={{
                                profileViews: stats?.profileViews || 0,
                                impressions: stats?.profileViews || 0 // Using profileViews as impressions for now
                            }}
                        />
                        <ActivitySidebar
                            title="Your Activity"
                            items={[
                                { icon: Clock, label: "Pending Requests", value: stats?.pending || 0 },
                                { icon: Users, label: "Profile Views", value: stats?.profileViews || 0 },
                                { icon: TrendingUp, label: "Accepted Requests", value: stats?.accepted || 0 }
                            ]}
                        />

                    </div>

                    {/* Middle Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Profile Completeness */}
                        {profileCompleteness < 100 && (
                            <CompletenessCard
                                profileCompleteness={profileCompleteness}
                                completenessBreakdown={completenessData}
                            />
                        )}

                        {/* Introduction Requests */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-secondary">
                                        Recent Introduction Requests
                                    </h3>
                                    <button
                                        onClick={() => {/* TODO: Navigate to full requests page */ }}
                                        className="text-primary text-sm font-semibold hover:text-[#1F5F3F]"
                                    >
                                        View All →
                                    </button>
                                </div>
                                {introductionRequests.length > 0 ? (
                                    introductionRequests.slice(0, 3).map((request: any) => (
                                        <IntroductionRequestCard
                                            key={request.id}
                                            request={request}
                                        />
                                    ))
                                ) : (
                                    <EmptyIntroductionRequests />
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <QuickActions
                            title="Quick Actions"
                            actions={[
                                {
                                    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
                                    icon: Users,
                                    label: "View Profile",
                                    type: 'link',
                                    href: '/professional/profile'
                                },
                                {
                                    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
                                    icon: Star,
                                    label: "Manage Skills",
                                    type: "link",
                                    href: "/professional/skills"
                                }
                            ]}
                        />
                        <MarketInsights />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProfessionalDashboardPage