"use client";

import { useEffect, useState } from 'react';
import { Clock, Users, TrendingUp, Building, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import ActivitySidebar from '@/components/professional/dashboard/ActivitySidebar';
import DashboardSkeleton from '@/components/professional/dashboard/DashboardSkeleton';
import HrProfileCard from '@/components/hr-partner/dashboard/HrProfileCard';
import ActiveJobsCard from '@/components/hr-partner/dashboard/ActiveJobsCard';
import CandidateMatchesCard from '@/components/hr-partner/dashboard/CandidateMatchesCard';
import HiringInsights from '@/components/hr-partner/dashboard/HiringInsights';
import QuickActions from '@/components/hr-partner/dashboard/QuickActions';

interface HrStats {
    activeJobs: number;
    totalCandidates: number;
    pendingIntroductions: number;
    successfulHires: number;
    trend?: 'up' | 'down' | 'stable';
}

const HrPartnerDashboard = () => {
    const [hrData, setHrData] = useState<any>(null);
    const [stats, setStats] = useState<HrStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHrData();
    }, []);

    const fetchHrData = async () => {
        try {
            setError(null);

            // Fetch HR partner stats
            const statsResponse = await fetch('/api/v1/hr-partners/stats');
            if (!statsResponse.ok) {
                throw new Error('Failed to fetch stats');
            }
            const statsData = await statsResponse.json();

            // Fetch HR partner profile data
            const profileResponse = await fetch('/api/v1/hr-partners/profile');
            let profileData = null;
            if (profileResponse.ok) {
                profileData = await profileResponse.json();
            }

            // Set HR data from profile or use defaults
            setHrData({
                firstName: profileData?.data?.firstName || 'HR Partner',
                lastName: profileData?.data?.lastName || '',
                jobTitle: profileData?.data?.jobTitle || 'HR Professional',
                company: {
                    companyName: profileData?.data?.company?.companyName || 'Your Company',
                    industry: profileData?.data?.company?.industry || 'Technology',
                    companySize: profileData?.data?.company?.companySize || 'Unknown'
                },
                profilePhotoUrl: profileData?.data?.profilePhotoUrl || null
            });

            // Set stats from API
            setStats({
                activeJobs: statsData.data.activeJobs,
                totalCandidates: statsData.data.totalIntroductions,
                pendingIntroductions: statsData.data.pendingIntroductions,
                successfulHires: statsData.data.completedIntroductions,
                trend: 'up' // Could be calculated based on historical data
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching HR data:', error);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const [activeJobs, setActiveJobs] = useState<any[]>([]);
    const [candidateMatches, setCandidateMatches] = useState<any[]>([]);

    useEffect(() => {
        fetchJobsAndMatches();
    }, []);

    const fetchJobsAndMatches = async () => {
        try {
            // Fetch jobs
            const jobsResponse = await fetch('/api/v1/hr-partners/jobs');
            if (jobsResponse.ok) {
                const jobsData = await jobsResponse.json();
                // Transform jobs data to match component expectations
                const transformedJobs = jobsData.data.slice(0, 3).map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    department: 'Engineering', // Default, could be enhanced
                    location: job.location,
                    salary: job.salaryRange || 'Competitive',
                    applicants: job.introductionRequestsCount,
                    matches: job.introductionRequestsCount,
                    status: job.status.toLowerCase(),
                    postedDate: new Date(job.createdAt).toLocaleDateString(),
                    urgency: 'medium' // Default, could be calculated
                }));
                setActiveJobs(transformedJobs);
            }

            // Fetch matches
            const matchesResponse = await fetch('/api/v1/hr-partners/matches');
            if (matchesResponse.ok) {
                const matchesData = await matchesResponse.json();
                // Transform matches data to match component expectations
                const transformedMatches = matchesData.data.slice(0, 3).map((match: any) => ({
                    id: match.id,
                    name: match.professional.name,
                    title: match.professional.currentTitle,
                    experience: '5+ years', // Default, could be enhanced
                    location: match.professional.location,
                    matchScore: 85, // Default, could be calculated
                    skills: [], // Could be enhanced with actual skills
                    jobId: match.job.id,
                    jobTitle: match.job.title,
                    status: match.status.toLowerCase() as 'new' | 'reviewed' | 'contacted' | 'interviewed'
                }));
                setCandidateMatches(transformedMatches);
            }
        } catch (error) {
            console.error('Error fetching jobs and matches:', error);
        }
    };



    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="bg-card rounded-sm shadow border border-border p-8 text-center max-w-md">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={fetchHrData}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
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
                                { icon: TrendingUp, label: "Successful Hires", value: stats?.successfulHires || 0 }
                            ]}
                        />
                        <HiringInsights />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HrPartnerDashboard;
