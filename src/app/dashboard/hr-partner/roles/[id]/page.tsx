'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface JobRole {
  id: string;
  roleTitle: string;
  roleDescription: string;
  responsibilities?: string;
  requirements: string;
  preferredQualifications?: string;
  seniorityLevel: string;
  industry: string;
  department?: string;
  locationCity: string;
  locationState: string;
  remoteOption: string;
  employmentType: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  benefits?: string;
  yearsExperienceMin: number;
  yearsExperienceMax?: number;
  requiredSkills?: string[];
  preferredSkills?: string[];
  isConfidential: boolean;
  confidentialReason?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  company: { companyName: string };
  createdBy: { firstName: string; lastName: string };
  _count: { introductionRequests: number };
}

export default function JobRoleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [jobRole, setJobRole] = useState<JobRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchJobRole = async () => {
      try {
        const response = await fetch(`/api/v1/job-roles/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch job role');

        const result = await response.json();
        setJobRole(result.data);
      } catch (error) {
        console.error('Error fetching job role:', error);
        toast.error('Failed to load job role');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRole();
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/v1/job-roles/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setJobRole(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
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

  const getValidStatusTransitions = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      DRAFT: ['ACTIVE', 'CLOSED'],
      ACTIVE: ['PAUSED', 'FILLED', 'CLOSED'],
      PAUSED: ['ACTIVE', 'CLOSED'],
      FILLED: ['CLOSED'],
      CLOSED: []
    };
    return transitions[currentStatus] || [];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!jobRole) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Role Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Roles
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{jobRole.roleTitle}</h1>
            <p className="text-muted-foreground">{jobRole.company.companyName}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(jobRole.status)}>
              {jobRole.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hr-partner/roles/${params.id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Role
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hr-partner/roles/${params.id}/applicants`)}>
              <UserCheck className="w-4 h-4 mr-2" />
              View Applicants ({jobRole._count.introductionRequests})
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{jobRole.locationCity}, {jobRole.locationState}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">₦{jobRole.salaryRangeMin.toLocaleString()} - ₦{jobRole.salaryRangeMax.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{jobRole._count.introductionRequests} introductions</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Created {new Date(jobRole.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Job Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{jobRole.roleDescription}</p>
            </div>

            {jobRole.responsibilities && (
              <div>
                <h4 className="font-medium mb-2">Key Responsibilities</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{jobRole.responsibilities}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Requirements</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{jobRole.requirements}</p>
            </div>

            {jobRole.preferredQualifications && (
              <div>
                <h4 className="font-medium mb-2">Preferred Qualifications</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{jobRole.preferredQualifications}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Seniority Level:</span>
                <span className="ml-2">{jobRole.seniorityLevel.replaceAll('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium">Employment Type:</span>
                <span className="ml-2">{jobRole.employmentType.replaceAll('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium">Industry:</span>
                <span className="ml-2">{jobRole.industry}</span>
              </div>
              <div>
                <span className="font-medium">Remote Option:</span>
                <span className="ml-2">{jobRole.remoteOption.replaceAll('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium">Experience:</span>
                <span className="ml-2">
                  {jobRole.yearsExperienceMin}+ years
                  {jobRole.yearsExperienceMax && ` (up to ${jobRole.yearsExperienceMax})`}
                </span>
              </div>
              {jobRole.department && (
                <div>
                  <span className="font-medium">Department:</span>
                  <span className="ml-2">{jobRole.department}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Change Status:</span>
              <Select
                value={jobRole.status}
                onValueChange={updateStatus}
                disabled={isUpdatingStatus || getValidStatusTransitions(jobRole.status).length === 0}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={jobRole.status} disabled>
                    {jobRole.status} (Current)
                  </SelectItem>
                  {getValidStatusTransitions(jobRole.status).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
