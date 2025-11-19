"use client";

import { useEffect, useState } from 'react';
import { Clock, Users, TrendingUp, Building, Search, Plus, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import ActivitySidebar from '@/components/professional/dashboard/ActivitySidebar';
import DashboardSkeleton from '@/components/professional/dashboard/DashboardSkeleton';
import HrProfileCard from '@/components/hr-partner/dashboard/HrProfileCard';
import ActiveJobsCard from '@/components/hr-partner/dashboard/ActiveJobsCard';
import CandidateMatchesCard from '@/components/hr-partner/dashboard/CandidateMatchesCard';
import HiringInsights from '@/components/hr-partner/dashboard/HiringInsights';
import QuickActions from '@/components/hr-partner/dashboard/QuickActions';
import { capitalize, getCompanySizeLabel } from '@/lib/utils';

interface HrStats {
    activeJobs: number;
    totalCandidates: number;
    pendingIntroductions: number;
    successfulHires: number;
    introductionCredits: number;
    trend?: 'up' | 'down' | 'stable';
}

interface IntroductionStats {
    totalSent: number;
    pending: number;
    accepted: number;
    declined: number;
    expired: number;
    acceptanceRate: number;
    averageResponseTime: number;
    thisMonth: number;
    lastMonth: number;
    trend: 'up' | 'down' | 'stable';
}

interface HrData {
    firstName: string;
    lastName: string;
    jobTitle: string;
    company: {
        companyName: string;
        industry: string;
        companySize: string;
    };
    profilePhotoUrl: string | null;
}

interface ActiveJob {
    id: string;
    title: string;
    department: string;
    location: string;
    salary: string;
    applicants: number;
    matches: number;
    status: string;
    postedDate: string;
    urgency: string;
}

interface CandidateMatch {
    id: string;
    name: string;
    title: string;
    experience: string;
    location: string;
    matchScore: number;
    skills: string[];
    jobId: string;
    jobTitle: string;
    status: 'new' | 'reviewed' | 'contacted' | 'interviewed';
}

const HrPartnerDashboard = () => {
    const [hrData, setHrData] = useState<any>(null);

    const [stats, setStats] = useState<HrStats | null>(null);
    const [introductionStats, setIntroductionStats] = useState<IntroductionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeJobs, setActiveJobs] = useState<any[]>([]);
    const [candidateMatches, setCandidateMatches] = useState<any[]>([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch HR partner stats
            const statsResponse = await fetch('/api/v1/hr-partners/stats');
            if (!statsResponse.ok) {
                throw new Error('Failed to fetch stats');
            }
            const statsData = await statsResponse.json();

            // Fetch introduction stats
            const introStatsResponse = await fetch('/api/v1/introductions/stats');
            let introStatsData = null;
            if (introStatsResponse.ok) {
                introStatsData = await introStatsResponse.json();
                setIntroductionStats(introStatsData.data);
            }

            // Fetch HR partner profile data
            const profileResponse = await fetch('/api/v1/hr-partners/me');
            let profileData = null;
            if (profileResponse.ok) {
                profileData = await profileResponse.json();
                console.log({ profileData });
            }

            // Set HR data from profile or use defaults
            setHrData({
                firstName: profileData?.data?.hrPartner?.firstName || 'HR HR',
                lastName: profileData?.data?.hrPartner?.lastName || 'Partner',
                jobTitle: profileData?.data?.hrPartner?.jobTitle || 'HR Professional',
                company: {
                    companyName: profileData?.data?.hrPartner?.company?.companyName || 'Your Company',
                    industry: capitalize(profileData?.data?.hrPartner?.company?.industry) || 'Technology',
                    companySize: getCompanySizeLabel(profileData?.data?.hrPartner?.company?.companySize) || 'Unknown'
                },
                profilePhotoUrl: profileData?.data?.hrPartner?.profilePhotoUrl || null
            });

            // Set stats from API
            setStats({
                activeJobs: statsData.data.activeJobs,
                totalCandidates: statsData.data.totalIntroductions,
                pendingIntroductions: statsData.data.pendingIntroductions,
                successfulHires: statsData.data.completedIntroductions,
                introductionCredits: statsData.data.introductionCredits || 0,
                trend: statsData.data.trend || undefined
            });

            // Fetch jobs
            const jobsResponse = await fetch('/api/v1/hr-partners/jobs');
            if (jobsResponse.ok) {
                const jobsData = await jobsResponse.json();
                const transformedJobs = jobsData.data.slice(0, 3).map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    department: job.department || 'Not specified',
                    location: job.location,
                    salary: job.salaryRange || 'Competitive',
                    applicants: job.introductionRequestsCount,
                    matches: job.introductionRequestsCount,
                    status: job.status.toLowerCase(),
                    postedDate: new Date(job.createdAt).toLocaleDateString(),
                    urgency: 'medium'
                }));
                setActiveJobs(transformedJobs);
            }

            // Fetch matches
            const matchesResponse = await fetch('/api/v1/hr-partners/matches');
            if (matchesResponse.ok) {
                const matchesData = await matchesResponse.json();
                const transformedMatches = matchesData.data.slice(0, 3).map((match: any) => ({
                    id: match.id,
                    name: match.professional.name,
                    title: match.professional.currentTitle,
                    experience: '5+ years',
                    location: match.professional.location,
                    matchScore: 85,
                    skills: [],
                    jobId: match.job.id,
                    jobTitle: match.job.title,
                    status: match.status.toLowerCase() as 'new' | 'reviewed' | 'contacted' | 'interviewed'
                }));
                setCandidateMatches(transformedMatches);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };


    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="bg-card rounded-lg shadow border border-border p-8 text-center max-w-md">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={fetchAllData}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Welcome back, {hrData?.firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's happening with your hiring pipeline today.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <HrProfileCard hrData={hrData} />
                        <QuickActions />
                    </div>

                    {/* Middle Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Active Jobs */}
                        <ActiveJobsCard jobs={activeJobs} />

                        {/* Candidate Matches */}
                        <CandidateMatchesCard matches={candidateMatches} />
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <ActivitySidebar
                            title="Hiring Stats"
                            items={[
                                { icon: Building, label: "Active Jobs", value: stats?.activeJobs || 0 },
                                { icon: Users, label: "Total Candidates", value: stats?.totalCandidates || 0 },
                                { icon: Clock, label: "Pending Introductions", value: stats?.pendingIntroductions || 0 },
                                { icon: TrendingUp, label: "Successful Hires", value: stats?.successfulHires || 0 },
                                { icon: CreditCard, label: "Introduction Credits", value: stats?.introductionCredits || 0 }
                            ]}
                        />

                        {/* Introduction Request Stats */}
                        {introductionStats && (
                            <div className="bg-card rounded-lg border border-border p-4">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Introduction Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Total Sent</span>
                                        <span className="font-medium">{introductionStats.totalSent}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Pending
                                        </span>
                                        <span className="font-medium text-yellow-600">{introductionStats.pending}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Accepted
                                        </span>
                                        <span className="font-medium text-green-600">{introductionStats.accepted}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <XCircle className="w-3 h-3" />
                                            Declined
                                        </span>
                                        <span className="font-medium text-red-600">{introductionStats.declined}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Expired
                                        </span>
                                        <span className="font-medium text-gray-600">{introductionStats.expired}</span>
                                    </div>
                                    <div className="pt-2 border-t border-border">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                                            <span className="font-medium">{introductionStats.acceptanceRate}%</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm text-muted-foreground">Avg Response Time</span>
                                            <span className="font-medium">{introductionStats.averageResponseTime}h</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-border">
                                        <Link
                                            href="/dashboard/hr-partner/introductions"
                                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                                        >
                                            View All Requests →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        <HiringInsights />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HrPartnerDashboard;
