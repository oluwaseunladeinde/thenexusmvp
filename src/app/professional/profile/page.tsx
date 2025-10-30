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

interface State {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

export default function ProfessionalProfilePage() {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [completenessData, setCompletenessData] = useState<any>(null);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [skillInput, setSkillInput] = useState('');
    const [uploadingResume, setUploadingResume] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

                skillsForm.reset({
                    skills: data.data.professional.skills?.map((s: any) => s.skillName) || [],
                });

                setSelectedState(data.data.professional.locationState || '');
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

    const handleFileUpload = async (file: File, type: 'profile' | 'resume') => {
        const setUploading = type === 'profile' ? setUploadingPhoto : setUploadingResume;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const response = await fetch('/api/v1/professionals/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(`${type === 'profile' ? 'Profile photo' : 'Resume'} uploaded successfully`);

                // Refresh profile data
                await fetchProfileData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
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
            const currentSkills = skillsForm.getValues('skills') || [];
            if (!currentSkills.includes(skillInput.trim())) {
                skillsForm.setValue('skills', [...currentSkills, skillInput.trim()]);
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const currentSkills = skillsForm.getValues('skills') || [];
        skillsForm.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">A complete profile increases your chances of getting introduction requests by 5x</p>
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
                            <CardContent className="space-y-4">
                                <form onSubmit={personalInfoForm.handleSubmit((data) => saveSection('Personal Information', data))}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">First Name *</label>
                                            <Input {...personalInfoForm.register('firstName')} />
                                            {personalInfoForm.formState.errors.firstName && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {personalInfoForm.formState.errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Last Name *</label>
                                            <Input {...personalInfoForm.register('lastName')} />
                                            {personalInfoForm.formState.errors.lastName && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {personalInfoForm.formState.errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Preferred Name</label>
                                        <Input {...personalInfoForm.register('preferredName')} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Profile Headline *</label>
                                        <Input {...personalInfoForm.register('profileHeadline')} />
                                        {personalInfoForm.formState.errors.profileHeadline && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {personalInfoForm.formState.errors.profileHeadline.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">State *</label>
                                            <Select value={selectedState} onValueChange={handleStateChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select state" />
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
                                        <div>
                                            <label className="block text-sm font-medium mb-1">City *</label>
                                            <Select
                                                value={personalInfoForm.watch('locationCity')}
                                                onValueChange={(value) => personalInfoForm.setValue('locationCity', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select city" />
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

                                    <Button type="submit" disabled={saving} className="w-full">
                                        {saving ? 'Saving...' : 'Save Personal Information'}
                                    </Button>
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
                            <CardContent className="space-y-4">
                                <form onSubmit={professionalDetailsForm.handleSubmit((data) => saveSection('Professional Details', data))}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Current Title *</label>
                                            <Input {...professionalDetailsForm.register('currentTitle')} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Current Company</label>
                                            <Input {...professionalDetailsForm.register('currentCompany')} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Industry *</label>
                                            <Select
                                                value={professionalDetailsForm.watch('currentIndustry')}
                                                onValueChange={(value) => professionalDetailsForm.setValue('currentIndustry', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select industry" />
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
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Years of Experience *</label>
                                            <Input
                                                type="number"
                                                {...professionalDetailsForm.register('yearsOfExperience', { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Profile Summary *</label>
                                        <Textarea
                                            {...professionalDetailsForm.register('profileSummary')}
                                            rows={4}
                                            placeholder="Describe your professional background, achievements, and career goals..."
                                        />
                                        {professionalDetailsForm.formState.errors.profileSummary && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {professionalDetailsForm.formState.errors.profileSummary.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Min Salary Expectation</label>
                                            <Input
                                                type="number"
                                                {...professionalDetailsForm.register('salaryExpectationMin', { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Max Salary Expectation</label>
                                            <Input
                                                type="number"
                                                {...professionalDetailsForm.register('salaryExpectationMax', { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Notice Period (Days)</label>
                                            <Input
                                                type="number"
                                                {...professionalDetailsForm.register('noticePeriodDays', { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    {...professionalDetailsForm.register('willingToRelocate')}
                                                />
                                                <span className="text-sm">Willing to relocate</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    {...professionalDetailsForm.register('openToOpportunities')}
                                                />
                                                <span className="text-sm">Open to new opportunities</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                                            <Input {...professionalDetailsForm.register('linkedinUrl')} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Portfolio URL</label>
                                            <Input {...professionalDetailsForm.register('portfolioUrl')} />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={saving} className="w-full">
                                        {saving ? 'Saving...' : 'Save Professional Details'}
                                    </Button>
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
                            <CardContent className="space-y-4">
                                <form onSubmit={skillsForm.handleSubmit((data) => saveSection('Skills', { skills: data.skills }))}>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Add Skills</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                placeholder="Enter a skill..."
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                            />
                                            <Button type="button" onClick={addSkill} variant="outline">
                                                Add
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Your Skills</label>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsForm.watch('skills')?.map((skill, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="text-gray-500 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        {skillsForm.formState.errors.skills && (
                                            <p className="text-red-500 text-sm">
                                                {skillsForm.formState.errors.skills.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" disabled={saving} className="w-full">
                                        {saving ? 'Saving...' : 'Save Skills'}
                                    </Button>
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
                                    {profileData?.resumeUrl ? (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-sm text-green-700">Resume uploaded</span>
                                            <a
                                                href={profileData.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm"
                                            >
                                                View Resume
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
                                                disabled={uploadingResume}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-[#1F5F3F]"
                                            />
                                            {uploadingResume && <p className="text-sm text-gray-500">Uploading...</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Profile Photo Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Profile Photo</label>
                                    {profileData?.profilePhotoUrl ? (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-sm text-green-700">Profile photo uploaded</span>
                                            <img
                                                src={profileData.profilePhotoUrl}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile')}
                                                disabled={uploadingPhoto}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-[#1F5F3F]"
                                            />
                                            {uploadingPhoto && <p className="text-sm text-gray-500">Uploading...</p>}
                                        </div>
                                    )}
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
