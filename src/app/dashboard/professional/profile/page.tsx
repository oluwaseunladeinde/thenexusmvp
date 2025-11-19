'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Upload, Phone, Shield, FileText, User, Briefcase, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploader } from '@/components/ui/FileUploader';
import { toast } from 'sonner';

// Form schemas
const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    preferredName: z.string().optional(),
    profileHeadline: z.string().min(1, 'Profile headline is required'),
    locationCity: z.string().min(1, 'City is required'),
    locationState: z.string().min(1, 'State is required'),
});

const professionalDetailsSchema = z.object({
    currentTitle: z.string().min(1, 'Current title is required'),
    currentCompany: z.string().optional(),
    currentIndustry: z.string().min(1, 'Industry is required'),
    yearsOfExperience: z.number().min(0),
    profileSummary: z.string().min(50, 'Profile summary must be at least 50 characters'),
    salaryExpectationMin: z.number().optional(),
    salaryExpectationMax: z.number().optional(),
    noticePeriodDays: z.number().min(0),
    willingToRelocate: z.boolean(),
    openToOpportunities: z.boolean(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
});

const skillsSchema = z.object({
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type ProfessionalDetailsData = z.infer<typeof professionalDetailsSchema>;
type SkillsData = z.infer<typeof skillsSchema>;

// Profile Avatar Component
const ProfileAvatar = ({ src, size = 'md', className = '' }: { src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-8 h-8'
    };

    if (src) {
        return (
            <img
                src={src}
                alt="Profile"
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
            <User className={`${iconSizes[size]} text-gray-400`} />
        </div>
    );
};

interface State {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

export default function ProfessionalProfilePage() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [completenessData, setCompletenessData] = useState<any>(null);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [skillInput, setSkillInput] = useState('');
    const [currentSkills, setCurrentSkills] = useState<string[]>([]);

    // Forms
    const personalInfoForm = useForm<PersonalInfoData>({
        resolver: zodResolver(personalInfoSchema),
    });

    const professionalDetailsForm = useForm<ProfessionalDetailsData>({
        resolver: zodResolver(professionalDetailsSchema),
    });

    const skillsForm = useForm<SkillsData>({
        resolver: zodResolver(skillsSchema),
    });

    // Load profile data
    useEffect(() => {
        fetchProfileData();
        fetchStates();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/v1/professionals/me');
            if (response.ok) {
                const data = await response.json();
                setProfileData(data.data.professional);
                setCompletenessData(data.data.completeness);

                // Populate forms
                personalInfoForm.reset({
                    firstName: data.data.professional.firstName || '',
                    lastName: data.data.professional.lastName || '',
                    preferredName: data.data.professional.preferredName || '',
                    profileHeadline: data.data.professional.profileHeadline || '',
                    locationCity: data.data.professional.locationCity || '',
                    locationState: data.data.professional.locationState || '',
                });

                professionalDetailsForm.reset({
                    currentTitle: data.data.professional.currentTitle || '',
                    currentCompany: data.data.professional.currentCompany || '',
                    currentIndustry: data.data.professional.currentIndustry || '',
                    yearsOfExperience: data.data.professional.yearsOfExperience || 0,
                    profileSummary: data.data.professional.profileSummary || '',
                    salaryExpectationMin: data.data.professional.salaryExpectationMin || undefined,
                    salaryExpectationMax: data.data.professional.salaryExpectationMax || undefined,
                    noticePeriodDays: data.data.professional.noticePeriodDays || 30,
                    willingToRelocate: data.data.professional.willingToRelocate || false,
                    openToOpportunities: data.data.professional.openToOpportunities || true,
                    linkedinUrl: data.data.professional.linkedinUrl || '',
                    portfolioUrl: data.data.professional.portfolioUrl || '',
                });

                const skillsData = data.data.professional.skills?.map((s: any) => s.skillName) || [];
                skillsForm.reset({
                    skills: skillsData,
                });
                setCurrentSkills(skillsData);

                setSelectedState(data.data.professional.locationState || '');

                // Fetch cities if state is already set
                if (data.data.professional.locationState) {
                    fetchCities(data.data.professional.locationState);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchStates = async () => {
        try {
            const response = await fetch('/api/v1/states');
            if (response.ok) {
                const data = await response.json();
                setStates(data);
            }
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchCities = async (stateId: string) => {
        try {
            const response = await fetch(`/api/v1/states/${stateId}/cities`);
            if (response.ok) {
                const data = await response.json();
                setCities(data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleStateChange = (stateId: string) => {
        setSelectedState(stateId);
        personalInfoForm.setValue('locationState', stateId);
        personalInfoForm.setValue('locationCity', '');
        setCities([]);
        if (stateId) {
            fetchCities(stateId);
        }
    };

    const handleFileUploadSuccess = async (url: string, type: 'profile' | 'resume', publicId?: string) => {
        try {
            // Update profile with the new file URL
            const updateData = {
                [type === 'profile' ? 'profilePhotoUrl' : 'resumeUrl']: url,
                ...(publicId && { [`${type}PublicId`]: publicId }),
            };

            console.log('Profile update data:', updateData);

            const response = await fetch('/api/v1/professionals/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                toast.success(`${type === 'profile' ? 'Profile photo' : 'Resume'} uploaded successfully`);
                // Refresh profile data to get updated completeness and file URLs
                await fetchProfileData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleFileUploadError = (error: string) => {
        toast.error(error);
    };

    const saveSkills = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/v1/professionals/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: currentSkills }),
            });

            if (response.ok) {
                toast.success('Skills updated successfully');
                await fetchProfileData();
            } else {
                const error = await response.json();
                console.error('Skills save error:', error);
                toast.error(error.error || 'Failed to save skills');
            }
        } catch (error) {
            console.error('Skills save error:', error);
            toast.error('Failed to save skills');
        } finally {
            setSaving(false);
        }
    };

    const saveSection = async (section: string, data: any) => {
        setSaving(true);
        try {
            const response = await fetch('/api/v1/professionals/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(`${section} updated successfully`);
                await fetchProfileData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            const currentSkillsList = skillsForm.getValues('skills') || [];
            if (!currentSkillsList.includes(skillInput.trim())) {
                const newSkills = [...currentSkillsList, skillInput.trim()];
                skillsForm.setValue('skills', newSkills);
                setCurrentSkills(newSkills);
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const currentSkillsList = skillsForm.getValues('skills') || [];
        const newSkills = currentSkillsList.filter(skill => skill !== skillToRemove);
        skillsForm.setValue('skills', newSkills);
        setCurrentSkills(newSkills);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Profile Header Skeleton */}
                    <div className="mb-8">
                        <div className="flex items-start gap-6 mb-6">
                            <Skeleton className="w-20 h-20 rounded-full" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-5 w-80" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                        </div>
                    </div>

                    {/* Completeness Overview Skeleton */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5" />
                                <Skeleton className="h-6 w-48" />
                            </div>
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-8" />
                                        </div>
                                        <Skeleton className="h-2 w-full" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs Skeleton */}
                    <div className="space-y-6">
                        <div className="grid w-full grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>

                        {/* Form Content Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-64" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Form Fields Skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-11 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-11 w-full" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-11 w-full" />
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-11 w-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-11 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-11 w-full" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-24 w-full" />
                                </div>

                                <div className="pt-4 border-t">
                                    <Skeleton className="h-11 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="mb-8">
                    <div className="flex items-start gap-6 mb-6">
                        <div className="flex-shrink-0">
                            <ProfileAvatar
                                src={profileData?.profilePhotoUrl}
                                size="lg"
                                className="border-4 border-white shadow-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {profileData?.firstName && profileData?.lastName
                                    ? `${profileData.firstName} ${profileData.lastName}`
                                    : 'Complete Your Profile'
                                }
                            </h1>
                            {profileData?.profileHeadline && (
                                <p className="text-lg text-gray-600 mb-2">{profileData.profileHeadline}</p>
                            )}
                            {profileData?.locationCity && profileData?.locationState && (
                                <p className="text-sm text-gray-500">
                                    {states.find(s => s.id === profileData.locationState)?.name || profileData.locationState}
                                    {cities.length > 0 && `, ${cities.find(c => c.id === profileData.locationCity)?.name || profileData.locationCity}`}
                                </p>
                            )}
                            <p className="text-gray-600 mt-2">A complete profile increases your chances of getting introduction requests by 5x</p>
                        </div>
                    </div>
                </div>

                {/* Completeness Overview */}
                {completenessData && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Profile Completeness
                            </CardTitle>
                            <CardDescription>
                                Overall completion: {completenessData.overall}%
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(completenessData.categories).map(([key, category]: [string, any]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {category.completed}/{category.total}
                                            </span>
                                        </div>
                                        <Progress value={(category.completed / category.total) * 100} className="h-2" />
                                        <div className="text-xs text-gray-500">
                                            {category.score}% contribution
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="personal" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value="professional" className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Professional
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Skills
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Documents
                        </TabsTrigger>
                        <TabsTrigger value="verification" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Verification
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Basic information about yourself</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={personalInfoForm.handleSubmit((data) => saveSection('Personal Information', data))} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">First Name *</label>
                                            <Input {...personalInfoForm.register('firstName')} className="h-11" />
                                            {personalInfoForm.formState.errors.firstName && (
                                                <p className="text-red-500 text-sm">
                                                    {personalInfoForm.formState.errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Last Name *</label>
                                            <Input {...personalInfoForm.register('lastName')} className="h-11" />
                                            {personalInfoForm.formState.errors.lastName && (
                                                <p className="text-red-500 text-sm">
                                                    {personalInfoForm.formState.errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Preferred Name</label>
                                        <Input {...personalInfoForm.register('preferredName')} className="h-11" placeholder="How would you like to be addressed?" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Profile Headline *</label>
                                        <Input {...personalInfoForm.register('profileHeadline')} className="h-11" placeholder="e.g., Senior Software Engineer at Tech Company" />
                                        {personalInfoForm.formState.errors.profileHeadline && (
                                            <p className="text-red-500 text-sm">
                                                {personalInfoForm.formState.errors.profileHeadline.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">State *</label>
                                            <Select value={selectedState} onValueChange={handleStateChange}>
                                                <SelectTrigger className="h-11 w-full">
                                                    <SelectValue placeholder="Select your state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {states.map((state) => (
                                                        <SelectItem key={state.id} value={state.id}>
                                                            {state.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">City *</label>
                                            <Select
                                                value={personalInfoForm.watch('locationCity')}
                                                onValueChange={(value) => personalInfoForm.setValue('locationCity', value)}
                                            >
                                                <SelectTrigger className="h-11 w-full">
                                                    <SelectValue placeholder="Select your city" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cities.map((city) => (
                                                        <SelectItem key={city.id} value={city.id}>
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button type="submit" disabled={saving} className="w-full h-11 font-medium">
                                            {saving ? 'Saving...' : 'Save Personal Information'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Professional Details */}
                    <TabsContent value="professional">
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Details</CardTitle>
                                <CardDescription>Your career information and preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={professionalDetailsForm.handleSubmit((data) => saveSection('Professional Details', data))} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Current Title *</label>
                                            <Input {...professionalDetailsForm.register('currentTitle')} className="h-11" placeholder="e.g., Senior Software Engineer" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Current Company</label>
                                            <Input {...professionalDetailsForm.register('currentCompany')} className="h-11" placeholder="e.g., Microsoft Nigeria" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Industry *</label>
                                            <Select
                                                value={professionalDetailsForm.watch('currentIndustry')}
                                                onValueChange={(value) => professionalDetailsForm.setValue('currentIndustry', value)}
                                            >
                                                <SelectTrigger className="h-11 w-full">
                                                    <SelectValue placeholder="Select your industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                    <SelectItem value="Retail">Retail</SelectItem>
                                                    <SelectItem value="Education">Education</SelectItem>
                                                    <SelectItem value="Government">Government</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Years of Experience *</label>
                                            <Input
                                                type="number"
                                                {...professionalDetailsForm.register('yearsOfExperience', { valueAsNumber: true })}
                                                className="h-11"
                                                placeholder="e.g., 5"
                                                min="0"
                                                max="50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Profile Summary *</label>
                                        <Textarea
                                            {...professionalDetailsForm.register('profileSummary')}
                                            rows={4}
                                            className="resize-none"
                                            placeholder="Describe your professional background, key achievements, and career goals. This helps HR partners understand your value proposition."
                                        />
                                        {professionalDetailsForm.formState.errors.profileSummary && (
                                            <p className="text-red-500 text-sm">
                                                {professionalDetailsForm.formState.errors.profileSummary.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-gray-900">Salary Expectations (Optional)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Minimum (₦)</label>
                                                <Input
                                                    type="number"
                                                    {...professionalDetailsForm.register('salaryExpectationMin', { valueAsNumber: true })}
                                                    className="h-11"
                                                    placeholder="e.g., 2000000"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Maximum (₦)</label>
                                                <Input
                                                    type="number"
                                                    {...professionalDetailsForm.register('salaryExpectationMax', { valueAsNumber: true })}
                                                    className="h-11"
                                                    placeholder="e.g., 3000000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Notice Period (Days)</label>
                                            <Input
                                                type="number"
                                                {...professionalDetailsForm.register('noticePeriodDays', { valueAsNumber: true })}
                                                className="h-11"
                                                placeholder="30"
                                                min="0"
                                                max="365"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-medium text-gray-700">Preferences</label>
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        {...professionalDetailsForm.register('willingToRelocate')}
                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-gray-700">Willing to relocate</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        {...professionalDetailsForm.register('openToOpportunities')}
                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-gray-700">Open to new opportunities</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-gray-900">Professional Links (Optional)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">LinkedIn URL</label>
                                                <Input {...professionalDetailsForm.register('linkedinUrl')} className="h-11" placeholder="https://linkedin.com/in/yourprofile" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Portfolio URL</label>
                                                <Input {...professionalDetailsForm.register('portfolioUrl')} className="h-11" placeholder="https://yourportfolio.com" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button type="submit" disabled={saving} className="w-full h-11 font-medium">
                                            {saving ? 'Saving...' : 'Save Professional Details'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Skills */}
                    <TabsContent value="skills">
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills & Expertise</CardTitle>
                                <CardDescription>Add your professional skills</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={(e) => { e.preventDefault(); saveSkills(); }} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Add Skills</label>
                                            <div className="flex gap-3">
                                                <Input
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                    className="h-11 flex-1"
                                                />
                                                <Button type="button" onClick={addSkill} variant="outline" className="h-11 px-6">
                                                    Add
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-500">Press Enter or click Add to include the skill</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700">Your Skills</label>
                                            {currentSkills?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
                                                    {currentSkills?.map((skill, index) => (
                                                        <Badge key={index} variant="light" className="flex items-center gap-2 px-3 py-1 text-sm">
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSkill(skill)}
                                                                className="text-gray-500 hover:text-red-500 ml-1 text-lg leading-none"
                                                            >
                                                                ×
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                                    <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">No skills added yet</p>
                                                    <p className="text-xs text-gray-400">Add your professional skills above</p>
                                                </div>
                                            )}
                                            {skillsForm.formState.errors.skills && (
                                                <p className="text-red-500 text-sm">
                                                    {skillsForm.formState.errors.skills.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button type="submit" disabled={saving} className="w-full h-11 font-medium">
                                            {saving ? 'Saving...' : 'Save Skills'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents */}
                    <TabsContent value="documents">
                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                                <CardDescription>Upload your resume and profile photo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Resume Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Resume</label>
                                    <FileUploader
                                        key={`resume-${profileData?.resumeUrl || 'empty'}`}
                                        type="resume"
                                        currentFileUrl={profileData?.resumeUrl}
                                        currentFileName={profileData?.resumeUrl ? "Resume.pdf" : undefined}
                                        onUploadSuccess={(url, publicId) => handleFileUploadSuccess(url, 'resume', publicId)}
                                        onUploadError={handleFileUploadError}
                                    />
                                </div>

                                {/* Profile Photo Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Profile Photo</label>
                                    <FileUploader
                                        key={`profile-${profileData?.profilePhotoUrl || 'empty'}`}
                                        type="profile"
                                        currentFileUrl={profileData?.profilePhotoUrl}
                                        currentFileName={profileData?.profilePhotoUrl ? "Profile Photo" : undefined}
                                        onUploadSuccess={(url, publicId) => handleFileUploadSuccess(url, 'profile', publicId)}
                                        onUploadError={handleFileUploadError}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Verification */}
                    <TabsContent value="verification">
                        <Card>
                            <CardHeader>
                                <CardTitle>Verification Status</CardTitle>
                                <CardDescription>Verify your account to increase credibility</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Profile Summary */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <ProfileAvatar src={profileData?.profilePhotoUrl} size="md" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {profileData?.firstName && profileData?.lastName
                                                ? `${profileData.firstName} ${profileData.lastName}`
                                                : 'Complete your profile'
                                            }
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {profileData?.profileHeadline || 'Add your professional headline'}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone Verification */}
                                <div className="flex items-center justify-between p-4 border rounded">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Phone Verification</p>
                                            <p className="text-sm text-gray-500">
                                                {profileData?.user?.phoneVerified ? 'Verified' : 'Not verified'}
                                            </p>
                                        </div>
                                    </div>
                                    {profileData?.user?.phoneVerified ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Button variant="outline" size="sm">
                                            Verify Phone
                                        </Button>
                                    )}
                                </div>

                                {/* Admin Verification */}
                                <div className="flex items-center justify-between p-4 border rounded">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Admin Verification</p>
                                            <p className="text-sm text-gray-500">
                                                {profileData?.verificationStatus === 'FULL' || profileData?.verificationStatus === 'PREMIUM'
                                                    ? 'Verified'
                                                    : 'Pending verification'}
                                            </p>
                                        </div>
                                    </div>
                                    {profileData?.verificationStatus === 'FULL' || profileData?.verificationStatus === 'PREMIUM' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
