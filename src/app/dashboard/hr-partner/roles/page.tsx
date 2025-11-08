'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin, Users, Calendar } from 'lucide-react';

interface JobRole {
  id: string;
  roleTitle: string;
  locationCity: string;
  locationState: string;
  employmentType: string;
  seniorityLevel: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  status: string;
  createdAt: string;
  _count: {
    introductionRequests: number;
  };
}

export default function JobRolesPage() {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<JobRole[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  useEffect(() => {
    let filtered = jobRoles;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(role => role.status === statusFilter);
    }

    if (seniorityFilter !== 'all') {
      filtered = filtered.filter(role => role.seniorityLevel === seniorityFilter);
    }

    if (employmentTypeFilter !== 'all') {
      filtered = filtered.filter(role => role.employmentType === employmentTypeFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(role => new Date(role.createdAt) >= filterDate);
    }

    setFilteredRoles(filtered);
  }, [jobRoles, statusFilter, seniorityFilter, employmentTypeFilter, dateFilter]);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch('/api/v1/job-roles');
      if (!response.ok) throw new Error('Failed to fetch job roles');

      const result = await response.json();
      setJobRoles(result.data);
    } catch (error) {
      console.error('Error fetching job roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'FILLED': return 'bg-blue-100 text-blue-800';
      case 'CLOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Job Roles</h1>
            <p className="text-muted-foreground">Manage your company's job postings</p>
          </div>
          <Link href="/dashboard/hr-partner/roles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Role
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
                <SelectItem value="FILLED">Filled</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by seniority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seniority</SelectItem>
                <SelectItem value="SENIOR">Senior</SelectItem>
                <SelectItem value="DIRECTOR">Director</SelectItem>
                <SelectItem value="VP">Vice President</SelectItem>
                <SelectItem value="C_SUITE">C-Suite</SelectItem>
                <SelectItem value="EXECUTIVE">Executive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={employmentTypeFilter} onValueChange={setEmploymentTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="CONSULTING">Consulting</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48 bg-white dark:bg-gray-800">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent className='bg-white dark:bg-gray-800'>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Last 24 hours</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRoles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground mb-4">
                {statusFilter === 'all' ? 'No job roles found' : `No ${statusFilter.toLowerCase()} roles found`}
              </div>
              <Link href="/dashboard/hr-partner/roles/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Role
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link href={`/dashboard/hr-partner/roles/${role.id}`}>
                        <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                          {role.roleTitle}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {role.locationCity}, {role.locationState}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {role._count.introductionRequests} introductions
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(role.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(role.status)}>
                      {role.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <div>{role.seniorityLevel.replace('_', ' ')} • {role.employmentType.replace('_', ' ')}</div>
                      <div className="font-medium text-foreground">
                        {formatSalary(role.salaryRangeMin, role.salaryRangeMax)}
                      </div>
                    </div>
                    <Link href={`/dashboard/hr-partner/roles/${role.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
