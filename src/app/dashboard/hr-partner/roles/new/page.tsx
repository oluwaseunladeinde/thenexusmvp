'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoneyField } from '@/components/ui/money-field';
import { toast } from 'sonner';
import JobTemplateSelector from '@/components/ui/job-template-selector';
import { JobTemplate } from '@/lib/job-templates';


export default function NewJobRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
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

  const handleTemplateSelect = (template: JobTemplate) => {
    setFormData({
      ...formData,
      roleTitle: template.roleTitle,
      roleDescription: template.roleDescription,
      responsibilities: template.responsibilities,
      requirements: template.requirements,
      preferredQualifications: template.preferredQualifications ?? '',
      seniorityLevel: template.seniorityLevel,
      industry: template.industry,
      department: template.department ?? '',
      requiredSkills: template.requiredSkills,
      preferredSkills: template.preferredSkills ?? [],
      yearsExperienceMin: template.yearsExperienceMin.toString(),
      benefits: template.benefits ?? '',
    });
    toast.success(`Template "${template.name}" applied! You can now customize the details.`);
  };

  const handleSubmit = async (isDraft = false) => {
    if (isDraft) {
      setIsDraftLoading(true);
    } else {
      setIsPublishLoading(true);
    }
    
    try {
      const payload = {
        ...formData,
        salaryRangeMin: parseInt(formData.salaryRangeMin),
        salaryRangeMax: parseInt(formData.salaryRangeMax),
        yearsExperienceMin: parseInt(formData.yearsExperienceMin),
        yearsExperienceMax: formData.yearsExperienceMax ? parseInt(formData.yearsExperienceMax) : undefined,
      };

      const response = await fetch('/api/v1/job-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create job role');

      const result = await response.json();

      if (isDraft) {
        toast.success('Job role saved as draft');
      } else {
        // Update status to ACTIVE
        await fetch(`/api/v1/job-roles/${result.data.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACTIVE' }),
        });
        toast.success('Job role published successfully');
      }

      router.push('/dashboard/hr-partner/roles');
    } catch (error) {
      toast.error('Failed to create job role');
    } finally {
      setIsDraftLoading(false);
      setIsPublishLoading(false);
    }
  };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch('/api/v1/industries');
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
  }, []);

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Job Role</h1>
          <p className="mt-2 text-muted-foreground">Post a new senior-level position</p>
        </div>

        {/* Template Selector */}
        <JobTemplateSelector onSelectTemplate={handleTemplateSelect} />

        <div className="space-y-8">
          <Card className="shadow-sm border">
            <CardHeader className="pb-1">
              <CardTitle className="text-xl text-foreground">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roleTitle" className="text-sm font-medium text-foreground">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="roleTitle"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleDescription" className="text-sm font-medium text-foreground">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="roleDescription"
                  value={formData.roleDescription}
                  onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                  placeholder="Describe the role and company"
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities" className="text-sm font-medium ">
                  Key Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="List main responsibilities"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-medium">
                  Requirements <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Required qualifications and experience"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardHeader className="pb-1">
              <CardTitle className="text-xl">Role Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="seniorityLevel" className="text-sm font-medium">
                    Seniority Level <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.seniorityLevel} onValueChange={(value) => setFormData({ ...formData, seniorityLevel: value })}>
                    <SelectTrigger className="h-11 w-full">
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

                <div className="space-y-2">
                  <Label htmlFor="employmentType" className="text-sm font-medium">
                    Employment Type
                  </Label>
                  <Select value={formData.employmentType} onValueChange={(value) => setFormData({ ...formData, employmentType: value })}>
                    <SelectTrigger className="h-11 w-full">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium ">
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger className="h-11 w-full">
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

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium ">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Engineering"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardHeader className="pb-1">
              <CardTitle className="text-xl">Location & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="locationState" className="text-sm font-medium">
                    State <span className="text-destructive">*</span>
                  </Label>
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
                    <SelectTrigger className="h-11 w-full">
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

                <div className="space-y-2">
                  <Label htmlFor="locationCity" className="text-sm font-medium">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.locationCity}
                    onValueChange={(value) => setFormData({ ...formData, locationCity: value })}
                    disabled={!formData.locationState || isLoadingCities}
                  >
                    <SelectTrigger className="h-11 w-full">
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

                <div className="space-y-2">
                  <Label htmlFor="remoteOption" className="text-sm font-medium">
                    Remote Option
                  </Label>
                  <Select value={formData.remoteOption} onValueChange={(value) => setFormData({ ...formData, remoteOption: value })}>
                    <SelectTrigger className="h-11 w-full">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salaryRangeMin" className="text-sm font-medium">
                    Minimum Salary (₦) <span className="text-red-500">*</span>
                  </Label>
                  <MoneyField
                    id="salaryRangeMin"
                    value={formData.salaryRangeMin}
                    onChange={(value) => setFormData({ ...formData, salaryRangeMin: value })}
                    placeholder="5,000,000"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryRangeMax" className="text-sm font-medium ">
                    Maximum Salary (₦) <span className="text-red-500">*</span>
                  </Label>
                  <MoneyField
                    id="salaryRangeMax"
                    value={formData.salaryRangeMax}
                    onChange={(value) => setFormData({ ...formData, salaryRangeMax: value })}
                    placeholder="8,000,000"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xl ">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="isConfidential"
                  checked={formData.isConfidential}
                  onCheckedChange={(checked) => setFormData({ ...formData, isConfidential: !!checked })}
                />
                <Label htmlFor="isConfidential" className="text-sm font-medium cursor-pointer">
                  Confidential Search
                </Label>
              </div>

              {formData.isConfidential && (
                <div className="space-y-2">
                  <Label htmlFor="confidentialReason" className="text-sm font-medium text-gray-700">
                    Reason for Confidentiality
                  </Label>
                  <Textarea
                    id="confidentialReason"
                    value={formData.confidentialReason}
                    onChange={(e) => setFormData({ ...formData, confidentialReason: e.target.value })}
                    placeholder="Why is this search confidential?"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isDraftLoading || isPublishLoading}
              className="h-11 px-8"
            >
              {isDraftLoading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              type="submit"
              variant={"default"}
              onClick={() => handleSubmit(false)}
              disabled={isDraftLoading || isPublishLoading}
              className="h-11 px-8 text-white"
            >
              {isPublishLoading ? 'Publishing...' : 'Publish Job Role'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
