'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import RichTextEditor from '@/components/ui/rich-text-editor';
import SkillsSelector from '@/components/ui/skills-selector';

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
    applicationDeadline?: string;
    expectedStartDate?: string;
}

export default function EditJobRolePage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [industries, setIndustries] = useState<{ id: string; industryName: string; industrySlug: string }[]>([]);
    const [states, setStates] = useState<{ id: string; name: string; code: string }[]>([]);
    const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [formData, setFormData] = useState({
        roleTitle: '',
        roleDescription: '',
        responsibilities: '',
        requirements: '',
        preferredQualifications: '',
        seniorityLevel: '',
        industry: '',
        department: '',
        locationCity: '',
        locationState: '',
        remoteOption: 'ON_SITE',
        employmentType: 'FULL_TIME',
        salaryRangeMin: '',
        salaryRangeMax: '',
        benefits: '',
        yearsExperienceMin: '5',
        yearsExperienceMax: '',
        requiredSkills: [] as string[],
        preferredSkills: [] as string[],
        isConfidential: false,
        confidentialReason: '',
        applicationDeadline: '',
        expectedStartDate: '',
    });

    useEffect(() => {
        fetchJobRole();
        const fetchIndustries = async () => {
            try {
                const response = await fetch('/api/industries');
                if (!response.ok) throw new Error('Failed to fetch industries');
                const data = await response.json();
                setIndustries(data);
            } catch (error) {
                console.error('Error fetching industries:', error);
                setIndustries([]);
            }
        };

        const fetchStates = async () => {
            try {
                const response = await fetch('/api/v1/states');
                if (!response.ok) throw new Error('Failed to fetch states');
                const data = await response.json();
                setStates(data);
            } catch (error) {
                console.error('Error fetching states:', error);
                setStates([]);
            }
        };

        fetchIndustries();
        fetchStates();
    }, [params.id]);

    const fetchJobRole = async () => {
        try {
            const response = await fetch(`/api/v1/job-roles/${params.id}`);
            if (!response.ok) throw new Error('Failed to fetch job role');

            const result = await response.json();
            const role = result.data;

            setFormData({
                roleTitle: role.roleTitle || '',
                roleDescription: role.roleDescription || '',
                responsibilities: role.responsibilities || '',
                requirements: role.requirements || '',
                preferredQualifications: role.preferredQualifications || '',
                seniorityLevel: role.seniorityLevel || '',
                industry: role.industry || '',
                department: role.department || '',
                locationCity: role.locationCity || '',
                locationState: role.locationState || '',
                remoteOption: role.remoteOption || 'ON_SITE',
                employmentType: role.employmentType || 'FULL_TIME',
                salaryRangeMin: role.salaryRangeMin?.toString() || '',
                salaryRangeMax: role.salaryRangeMax?.toString() || '',
                benefits: role.benefits || '',
                yearsExperienceMin: role.yearsExperienceMin?.toString() || '5',
                yearsExperienceMax: role.yearsExperienceMax?.toString() || '',
                requiredSkills: role.requiredSkills || [],
                preferredSkills: role.preferredSkills || [],
                isConfidential: role.isConfidential || false,
                confidentialReason: role.confidentialReason || '',
                applicationDeadline: role.applicationDeadline ? role.applicationDeadline.split('T')[0] : '',
                expectedStartDate: role.expectedStartDate ? role.expectedStartDate.split('T')[0] : '',
            });
        } catch (error) {
            console.error('Error fetching job role:', error);
            toast.error('Failed to load job role');
            router.push('/dashboard/hr-partner/roles');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        // Validate required fields
        if (!formData.roleTitle || !formData.roleDescription || !formData.requirements ||
            !formData.seniorityLevel || !formData.industry || !formData.locationState ||
            !formData.locationCity || !formData.salaryRangeMin || !formData.salaryRangeMax ||
            !formData.yearsExperienceMin) {
            toast.error('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        // Validate numeric fields
        const salaryMin = parseInt(formData.salaryRangeMin, 10);
        const salaryMax = parseInt(formData.salaryRangeMax, 10);
        const expMin = parseInt(formData.yearsExperienceMin, 10);
        const expMax = formData.yearsExperienceMax ? parseInt(formData.yearsExperienceMax, 10) : undefined;

        if (isNaN(salaryMin) || isNaN(salaryMax) || isNaN(expMin) || (expMax !== undefined && isNaN(expMax))) {
            toast.error('Please enter valid numbers for salary and experience fields');
            setIsLoading(false);
            return;
        }

        if (salaryMin > salaryMax) {
            toast.error('Minimum salary cannot exceed maximum salary');
            setIsLoading(false);
            return;
        }

        if (expMax !== undefined && expMin > expMax) {
            toast.error('Minimum experience cannot exceed maximum experience');
            setIsLoading(false);
            return;
        }
        if (salaryMin < 0 || salaryMax < 0) {
            toast.error('Salary values must be positive');
            setIsLoading(false);
            return;
        }

        if (expMin < 0 || (expMax !== undefined && expMax < 0)) {
            toast.error('Experience values must be positive');
            setIsLoading(false);
            return;
        }


        try {
            const payload = {
                ...formData,
                salaryRangeMin: salaryMin,
                salaryRangeMax: salaryMax,
                yearsExperienceMin: expMin,
                yearsExperienceMax: expMax,
                applicationDeadline: formData.applicationDeadline || undefined,
                expectedStartDate: formData.expectedStartDate || undefined,
            };

            const response = await fetch(`/api/v1/job-roles/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to update job role');

            toast.success('Job role updated successfully');
            router.push(`/dashboard/hr-partner/roles/${params.id}`);
        } catch (error) {
            console.error('Error updating job role:', error);
            toast.error('Failed to update job role');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="container mx-auto py-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Job Role</h1>
                <p className="text-muted-foreground">Update the job role details</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="roleTitle">Job Title *</Label>
                            <Input
                                id="roleTitle"
                                value={formData.roleTitle}
                                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>

                        <div>
                            <Label htmlFor="roleDescription">Job Description *</Label>
                            <RichTextEditor
                                value={formData.roleDescription}
                                onChange={(value) => setFormData({ ...formData, roleDescription: value })}
                                placeholder="Describe the role and company"
                            />
                        </div>

                        <div>
                            <Label htmlFor="responsibilities">Key Responsibilities</Label>
                            <RichTextEditor
                                value={formData.responsibilities}
                                onChange={(value) => setFormData({ ...formData, responsibilities: value })}
                                placeholder="List main responsibilities"
                            />
                        </div>

                        <div>
                            <Label htmlFor="requirements">Requirements *</Label>
                            <RichTextEditor
                                value={formData.requirements}
                                onChange={(value) => setFormData({ ...formData, requirements: value })}
                                placeholder="Required qualifications and experience"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills & Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SkillsSelector
                            requiredSkills={formData.requiredSkills}
                            preferredSkills={formData.preferredSkills}
                            onRequiredSkillsChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
                            onPreferredSkillsChange={(skills) => setFormData({ ...formData, preferredSkills: skills })}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="seniorityLevel">Seniority Level *</Label>
                                <Select value={formData.seniorityLevel} onValueChange={(value) => setFormData({ ...formData, seniorityLevel: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SENIOR">Senior</SelectItem>
                                        <SelectItem value="DIRECTOR">Director</SelectItem>
                                        <SelectItem value="VP">Vice President</SelectItem>
                                        <SelectItem value="C_SUITE">C-Suite</SelectItem>
                                        <SelectItem value="EXECUTIVE">Executive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="employmentType">Employment Type</Label>
                                <Select value={formData.employmentType} onValueChange={(value) => setFormData({ ...formData, employmentType: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                        <SelectItem value="CONTRACT">Contract</SelectItem>
                                        <SelectItem value="CONSULTING">Consulting</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="industry">Industry *</Label>
                                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industries.map((industry) => (
                                            <SelectItem key={industry.id} value={industry.industryName}>
                                                {industry.industryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="e.g. Engineering"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Location & Compensation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="locationState">State *</Label>
                                <Select
                                    value={formData.locationState}
                                    onValueChange={(value) => {
                                        setFormData({ ...formData, locationState: value, locationCity: '' });
                                        // Find the selected state to get its ID
                                        const selectedState = states.find(state => state.name === value);
                                        if (selectedState) {
                                            // Fetch cities for the selected state using its ID
                                            const fetchCities = async () => {
                                                setIsLoadingCities(true);
                                                try {
                                                    const response = await fetch(`/api/v1/states/${selectedState.id}/cities`);
                                                    if (!response.ok) throw new Error('Failed to fetch cities');
                                                    const data = await response.json();
                                                    setCities(data);
                                                } catch (error) {
                                                    console.error('Error fetching cities:', error);
                                                    setCities([]);
                                                } finally {
                                                    setIsLoadingCities(false);
                                                }
                                            };
                                            fetchCities();
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((state) => (
                                            <SelectItem key={state.id} value={state.name}>
                                                {state.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="locationCity">City *</Label>
                                <Select
                                    value={formData.locationCity}
                                    onValueChange={(value) => setFormData({ ...formData, locationCity: value })}
                                    disabled={!formData.locationState || isLoadingCities}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingCities ? "Loading cities..." : "Select city"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city.id} value={city.name}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="remoteOption">Remote Option</Label>
                                <Select value={formData.remoteOption} onValueChange={(value) => setFormData({ ...formData, remoteOption: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ON_SITE">On-site</SelectItem>
                                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                                        <SelectItem value="REMOTE">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="salaryRangeMin">Minimum Salary (₦) *</Label>
                                <Input
                                    id="salaryRangeMin"
                                    type="number"
                                    value={formData.salaryRangeMin}
                                    onChange={(e) => setFormData({ ...formData, salaryRangeMin: e.target.value })}
                                    placeholder="5000000"
                                />
                            </div>

                            <div>
                                <Label htmlFor="salaryRangeMax">Maximum Salary (₦) *</Label>
                                <Input
                                    id="salaryRangeMax"
                                    type="number"
                                    value={formData.salaryRangeMax}
                                    onChange={(e) => setFormData({ ...formData, salaryRangeMax: e.target.value })}
                                    placeholder="8000000"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isConfidential"
                                checked={formData.isConfidential}
                                onCheckedChange={(checked) => setFormData({ ...formData, isConfidential: !!checked })}
                            />
                            <Label htmlFor="isConfidential">Confidential Search</Label>
                        </div>

                        {formData.isConfidential && (
                            <div>
                                <Label htmlFor="confidentialReason">Reason for Confidentiality</Label>
                                <RichTextEditor
                                    value={formData.confidentialReason}
                                    onChange={(value) => setFormData({ ...formData, confidentialReason: value })}
                                    placeholder="Why is this search confidential?"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Update Job Role
                    </Button>
                </div>
            </div>
        </div>
    );
}
