'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, Clock, Target, Users } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/platform/FileUploader';

const hrOnboardingSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    jobTitle: z.string().min(2, 'Job title is required'),
    department: z.string().min(2, 'Department is required'),
    linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    companyName: z.string().min(2, 'Company name is required'),
    industry: z.string().min(1, 'Industry is required'),
    companySize: z.string().min(1, 'Company size is required'),
    companyWebsite: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
    companyDescription: z.string().min(10, 'Company description is required'),
    headquartersLocation: z.string().min(2, 'Headquarters location is required'),
    companyLogoUrl: z.string().optional(),
    hiringTimeline: z.string().min(1, 'Hiring timeline is required'),
    numberOfRoles: z.string().min(1, 'Number of roles is required'),
    teamSize: z.string().min(1, 'Team size is required'),
});

export type HrOnboardingData = z.infer<typeof hrOnboardingSchema>;

interface Props {
    userId: string;
    userEmail: string;
}

export default function HrOnboardingWizard({ userId, userEmail }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [logoUrl, setLogoUrl] = useState<string>('');

    const form = useForm<HrOnboardingData>({
        resolver: zodResolver(hrOnboardingSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            jobTitle: '',
            department: '',
            linkedinUrl: '',
            companyName: '',
            industry: '',
            companySize: '',
            companyWebsite: '',
            companyDescription: '',
            headquartersLocation: '',
            companyLogoUrl: '',
            hiringTimeline: '',
            numberOfRoles: '',
            teamSize: '',
        },
    });

    const {
        handleSubmit,
        trigger,
        formState: { errors },
    } = form;

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleNext = async () => {
        let fieldsToValidate: (keyof HrOnboardingData)[] = [];

        if (step === 1) {
            fieldsToValidate = ['firstName', 'lastName', 'jobTitle', 'department'];
        } else if (step === 2) {
            fieldsToValidate = ['companyName', 'industry', 'companySize', 'companyDescription', 'headquartersLocation'];
        }

        const isValid = await trigger(fieldsToValidate);

        if (isValid && step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleLogoUploadSuccess = (url: string) => {
        setLogoUrl(url);
        form.setValue('companyLogoUrl', url);
    };

    const handleLogoUploadError = (error: string) => {
        toast.error(`Logo upload failed: ${error}`);
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const onSubmit = async (data: HrOnboardingData) => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/hr-partners/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    companyLogoUrl: logoUrl || undefined,
                    userId,
                    userEmail,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create HR partner profile');
            }

            toast.success('Welcome to theNexus! Your profile has been created.');
            router.push('/dashboard/hr-partner');
        } catch (error) {
            console.error('Error creating HR partner:', error);
            toast.error('Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStepTitle = () => {
        if (step === 1) return 'Personal Information';
        if (step === 2) return 'Company Information';
        if (step === 3) return 'Hiring Plans';
        return '';
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">
                        Set up your HR profile
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        Step {step} of {totalSteps}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="text-sm text-muted-foreground mb-6">
                                        Let's start with your basic information. This helps us personalize your experience.
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="jobTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job Title *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., HR Manager, Talent Acquisition Lead" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="department"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Human Resources, Talent Acquisition" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="linkedinUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="text-sm text-muted-foreground mb-6">
                                        Tell us about your company to help us match you with the right professionals.
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Acme Corporation" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="industry"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Industry *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select industry" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="technology">Technology</SelectItem>
                                                            <SelectItem value="finance">Finance</SelectItem>
                                                            <SelectItem value="healthcare">Healthcare</SelectItem>
                                                            <SelectItem value="education">Education</SelectItem>
                                                            <SelectItem value="retail">Retail</SelectItem>
                                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                                            <SelectItem value="consulting">Consulting</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="companySize"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Company Size *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select size" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                                                            <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                                                            <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                                                            <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                                                            <SelectItem value="501-1000 employees">501-1000 employees</SelectItem>
                                                            <SelectItem value="1001-5000 employees">1001-5000 employees</SelectItem>
                                                            <SelectItem value="5000+ employees">5000+ employees</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="companyWebsite"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Website (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://www.company.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Description *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Brief description of your company and what you do..."
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="headquartersLocation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Headquarters Location *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Lagos, Nigeria" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Company Logo Upload */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Company Logo (Optional)</label>
                                        <FileUploader
                                            type="profile"
                                            onUploadSuccess={handleLogoUploadSuccess}
                                            onUploadError={handleLogoUploadError}
                                            acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                                            maxSize={5 * 1024 * 1024} // 5MB
                                            currentFileUrl={logoUrl}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Upload your company logo (max 5MB, PNG/JPG/GIF/WebP)
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="text-sm text-muted-foreground mb-6">
                                        Help us understand your hiring needs to provide better matches.
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="hiringTimeline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hiring Timeline *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="When do you plan to hire?" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="immediately">Immediately</SelectItem>
                                                        <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                                                        <SelectItem value="1 month">1 month</SelectItem>
                                                        <SelectItem value="2-3 months">2-3 months</SelectItem>
                                                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                                                        <SelectItem value="6+ months">6+ months</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="numberOfRoles"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Number of Roles to Fill *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select number" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">1 role</SelectItem>
                                                            <SelectItem value="2-3">2-3 roles</SelectItem>
                                                            <SelectItem value="4-5">4-5 roles</SelectItem>
                                                            <SelectItem value="6-10">6-10 roles</SelectItem>
                                                            <SelectItem value="10+">10+ roles</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="teamSize"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Team Size *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select team size" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1-5">1-5 people</SelectItem>
                                                            <SelectItem value="6-10">6-10 people</SelectItem>
                                                            <SelectItem value="11-20">11-20 people</SelectItem>
                                                            <SelectItem value="21-50">21-50 people</SelectItem>
                                                            <SelectItem value="50+">50+ people</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Trial Info Box */}
                                    <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-green-800 flex items-center gap-2 dark:text-green-400">
                                                <CheckCircle className="h-5 w-5" />
                                                What happens next?
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-green-700 space-y-3 dark:text-green-300">
                                            <div className="flex items-start gap-3">
                                                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">14-day free trial</p>
                                                    <p className="text-sm">Full access to all features, no credit card required</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Target className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">5 introduction credits</p>
                                                    <p className="text-sm">Connect with up to 5 senior professionals immediately</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">Dedicated support</p>
                                                    <p className="text-sm">Our team will help you get started and find the right talent</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-between mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={step === 1}
                            className="flex items-center gap-2 text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        {step < totalSteps ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating Profile...
                                    </>
                                ) : (
                                    'Complete Setup'
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
