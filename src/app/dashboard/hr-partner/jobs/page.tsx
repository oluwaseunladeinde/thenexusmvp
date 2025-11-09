"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JobCard from '@/components/hr-partner/jobs/JobCard';
import JobsSkeleton from '@/components/hr-partner/jobs/JobsSkeleton';
import EmptyJobsState from '@/components/hr-partner/jobs/EmptyJobsState';

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    salary: string;
    type: 'full-time' | 'part-time' | 'contract';
    status: 'active' | 'paused' | 'closed';
    applicants: number;
    matches: number;
    postedDate: string;
    expiryDate: string;
    urgency: 'high' | 'medium' | 'low';
    description: string;
}

const JobsPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchQuery, statusFilter, jobs]);

    const fetchJobs = async () => {
        // Mock data - replace with actual API call
        setTimeout(() => {
            const mockJobs: Job[] = [
                {
                    id: 1,
                    title: 'Senior Software Engineer',
                    department: 'Engineering',
                    location: 'Lagos, Nigeria',
                    salary: '₦8-12M',
                    type: 'full-time',
                    status: 'active',
                    applicants: 24,
                    matches: 8,
                    postedDate: '3 days ago',
                    expiryDate: '27 days left',
                    urgency: 'high',
                    description: 'We are looking for a senior software engineer to join our growing team...'
                },
                {
                    id: 2,
                    title: 'Product Manager',
                    department: 'Product',
                    location: 'Remote',
                    salary: '₦6-10M',
                    type: 'full-time',
                    status: 'active',
                    applicants: 18,
                    matches: 5,
                    postedDate: '1 week ago',
                    expiryDate: '23 days left',
                    urgency: 'medium',
                    description: 'Join our product team to drive innovation and growth...'
                },
                {
                    id: 3,
                    title: 'Data Scientist',
                    department: 'Analytics',
                    location: 'Abuja, Nigeria',
                    salary: '₦7-11M',
                    type: 'full-time',
                    status: 'paused',
                    applicants: 12,
                    matches: 3,
                    postedDate: '2 weeks ago',
                    expiryDate: '16 days left',
                    urgency: 'low',
                    description: 'Help us unlock insights from data to drive business decisions...'
                },
                {
                    id: 4,
                    title: 'Frontend Developer',
                    department: 'Engineering',
                    location: 'Lagos, Nigeria',
                    salary: '₦4-7M',
                    type: 'contract',
                    status: 'closed',
                    applicants: 31,
                    matches: 12,
                    postedDate: '1 month ago',
                    expiryDate: 'Expired',
                    urgency: 'medium',
                    description: 'Build beautiful and responsive user interfaces...'
                }
            ];
            setJobs(mockJobs);
            setLoading(false);
        }, 1000);
    };

    const filterJobs = () => {
        let filtered = jobs;

        if (searchQuery) {
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(job => job.status === statusFilter);
        }

        setFilteredJobs(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
    };

    if (loading) {
        return <JobsSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Your Offers</h1>
                        <p className="text-muted-foreground">
                            Manage your opportunities and track introduction requests
                        </p>
                    </div>
                    <Link href="/dashboard/hr-partner/jobs/create">
                        <Button className="flex items-center gap-2 w-full sm:w-auto">
                            <Plus className="w-4 h-4" />
                            Create Offer
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search offers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 md:w-auto"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="border-t border-border pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Status
                                    </label>
                                    <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value || '')}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                                            <SelectItem value="active" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Active</SelectItem>
                                            <SelectItem value="paused" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Paused</SelectItem>
                                            <SelectItem value="closed" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="w-full lg:w-auto"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
                        <p className="text-sm text-muted-foreground">
                            {filteredJobs.length} of {jobs.length} offers
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort:</span>
                            <Select defaultValue="recent">
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                                    <SelectItem value="recent" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Recent</SelectItem>
                                    <SelectItem value="title" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Title</SelectItem>
                                    <SelectItem value="applicants" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Applicants</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredJobs.length === 0 && (
                    <EmptyJobsState 
                        hasFilters={searchQuery !== '' || statusFilter !== ''}
                        onClearFilters={clearFilters}
                    />
                )}
            </div>
        </div>
    );
};

export default JobsPage;
