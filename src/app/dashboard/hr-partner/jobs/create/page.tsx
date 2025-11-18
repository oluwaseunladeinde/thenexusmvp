"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobCreationOptions from '@/components/ui/job-creation-options';
import RichTextEditor from '@/components/ui/rich-text-editor';
import SkillsSelector from '@/components/ui/skills-selector';
import { JobTemplate } from '@/lib/job-templates';
import { toast } from 'sonner';

const jobSchema = z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    department: z.string().min(2, 'Department is required'),
    location: z.string().min(2, 'Location is required'),
    type: z.enum(['full-time', 'part-time', 'contract']),
    salaryMin: z.string().min(1, 'Minimum salary is required'),
    salaryMax: z.string().min(1, 'Maximum salary is required'),
    currency: z.string().min(1, 'Currency is required'),
    description: z.string().min(50, 'Job description must be at least 50 characters'),
    requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
    benefits: z.string().optional(),
    skills: z.array(z.string()).min(1, 'At least one required skill must be specified'),
    preferredSkills: z.array(z.string()).optional(),
    experience: z.string().min(1, 'Experience level is required'),
    urgency: z.enum(['high', 'medium', 'low']),
    expiryDays: z.string().min(1, 'Expiry period is required'),
}).refine((data) => Number(data.salaryMax) > Number(data.salaryMin), {
    message: 'Maximum salary must be greater than minimum salary',
    path: ['salaryMax'],
});

type JobFormData = z.infer<typeof jobSchema>;

const CreateJobPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
    const [preferredSkills, setPreferredSkills] = useState<string[]>([]);

    const form = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: '',
            department: '',
            location: '',
            type: 'full-time',
            salaryMin: '',
            salaryMax: '',
            currency: 'NGN',
            description: '',
            requirements: '',
            benefits: '',
            skills: [],
            preferredSkills: [],
            experience: '',
            urgency: 'medium',
            expiryDays: '30',
        },
    });

    const handleTemplateSelect = (template: JobTemplate) => {
        form.setValue('title', template.roleTitle);
        form.setValue('department', template.department || '');
        setRequiredSkills(template.requiredSkills);
        setPreferredSkills(template.preferredSkills || []);
        form.setValue('experience', template.yearsExperienceMin.toString());
        form.setValue('description', template.roleDescription);
        form.setValue('requirements', template.requirements);
        form.setValue('benefits', template.benefits || '');
        setShowForm(true);

        toast.success(`Template "${template.name}" applied! You can now customize the details.`);
    };

    const handleAiGenerate = (generatedContent: {
        description: string;
        requirements: string;
        benefits: string;
    }) => {
        form.setValue('description', generatedContent.description);
        form.setValue('requirements', generatedContent.requirements);
        form.setValue('benefits', generatedContent.benefits);
        setShowForm(true);
    };

    const handleCreateManually = () => {
        setShowForm(true);
    };

    const onSubmit = async (data: JobFormData) => {
        setLoading(true);
        try {
            // Prepare data with skills arrays
            const submitData = {
                ...data,
                skills: requiredSkills,
                preferredSkills: preferredSkills,
            };

            // Mock API call - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Job data:', submitData);
            toast.success('Job created successfully!');
            router.push('/dashboard/hr-partner/jobs');
        } catch (error) {
            console.error('Error creating job:', error);
            toast.error('Failed to create job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {!showForm ? (
                    <div className="flex flex-col space-y-4 items-center justify-center py-12 sm:px-6 lg:px-8">
                        <JobCreationOptions
                            onTemplateSelect={handleTemplateSelect}
                            onAiGenerate={handleAiGenerate}
                            onCreateManually={handleCreateManually}
                            currentValues={{
                                title: form.watch('title'),
                                industry: '', // Could be derived from department or added as a field
                                experience: form.watch('experience'),
                            }}
                        />
                        <p className="text-muted-foreground">Once you have selected a template or created manually, you can proceed with the rest of the job creation process.</p>
                        <Link href="/dashboard/hr-partner/jobs">
                            <Button variant="outline" size="sm" className="mt-4 cursor-pointer">
                                Back to Jobs
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/dashboard/hr-partner/jobs">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Jobs
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Create New Job</h1>
                                <p className="text-muted-foreground">Define a job opportunity to attract and connect with top talent</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Opportunity Title *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Senior Software Engineer" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="department"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Department *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Engineering" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Employment Type *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className='w-full'>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="full-time">Full-time</SelectItem>
                                                                <SelectItem value="part-time">Part-time</SelectItem>
                                                                <SelectItem value="contract">Contract</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Lagos, Nigeria or Remote" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Compensation */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Compensation</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="salaryMin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Min Salary (Annual) *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. 8000000" type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="salaryMax"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Max Salary (Annual) *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. 12000000" type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="currency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Currency</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className='w-full'>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="NGN">NGN (₦)</SelectItem>
                                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Opportunity Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Opportunity Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Opportunity Description *</FormLabel>
                                                    <FormControl>
                                                        <RichTextEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="requirements"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Requirements *</FormLabel>
                                                    <FormControl>
                                                        <RichTextEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="List the key requirements, qualifications, and experience needed..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="benefits"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Benefits (Optional)</FormLabel>
                                                    <FormControl>
                                                        <RichTextEditor
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            placeholder="Health insurance, flexible working, learning budget, etc..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Skills Section */}
                                        <SkillsSelector
                                            requiredSkills={requiredSkills}
                                            preferredSkills={preferredSkills}
                                            onRequiredSkillsChange={setRequiredSkills}
                                            onPreferredSkillsChange={setPreferredSkills}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="experience"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Experience Level *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select experience level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                                            <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                                                            <SelectItem value="senior">Senior Level (6-8 years)</SelectItem>
                                                            <SelectItem value="lead">Lead Level (9+ years)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Posting Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Posting Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="urgency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Urgency Level</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className='w-full'>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="low">Low</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="high">High</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="expiryDays"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Expires In (Days)</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className='w-full'>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="7">7 days</SelectItem>
                                                                <SelectItem value="14">14 days</SelectItem>
                                                                <SelectItem value="30">30 days</SelectItem>
                                                                <SelectItem value="60">60 days</SelectItem>
                                                                <SelectItem value="90">90 days</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Submit Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                        Back to Options
                                    </Button>
                                    <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating Offer...
                                            </>
                                        ) : (
                                            'Create Offer'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateJobPage;
