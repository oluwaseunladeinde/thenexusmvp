'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HrOnboardingData } from '../HrOnboardingWizard';

const step1Schema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    jobTitle: z.string().min(2, 'Job title is required'),
    department: z.string().min(2, 'Department is required'),
    linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
});

type Step1Data = z.infer<typeof step1Schema>;

interface Props {
    data: HrOnboardingData;
    onChange: (data: HrOnboardingData) => void;
    onValidation: (isValid: boolean) => void;
}

export function HrStep1PersonalInfo({ data, onChange, onValidation }: Props) {
    const [mounted, setMounted] = useState(false);
    
    const form = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            firstName: data.firstName,
            lastName: data.lastName,
            jobTitle: data.jobTitle,
            department: data.department,
            linkedinUrl: data.linkedinUrl,
        },
        mode: 'onChange',
    });

    const { watch, formState: { isValid } } = form;
    const watchedValues = watch();

    // Handle mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update parent data when form values change
    useEffect(() => {
        if (mounted) {
            onChange({
                ...data,
                ...watchedValues,
            });
        }
    }, [watchedValues, mounted]);

    // Update validation status
    useEffect(() => {
        if (mounted) {
            onValidation(isValid);
        }
    }, [isValid, mounted]);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="space-y-6">
                <div className="text-sm text-gray-600 mb-6">
                    Let's start with your basic information. This helps us personalize your experience.
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-6 dark:text-gray-400">
                Let's start with your basic information. This helps us personalize your experience.
            </div>

            <Form {...form}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="dark:text-gray-200">First Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                                <FormLabel className="dark:text-gray-200">Last Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                            <FormLabel className="dark:text-gray-200">Job Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., HR Manager, Talent Acquisition Lead" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                            <FormLabel className="dark:text-gray-200">Department *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Human Resources, Talent Acquisition" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                            <FormLabel className="dark:text-gray-200">LinkedIn Profile (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://linkedin.com/in/your-profile"
                                    {...field}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </Form>
        </div>
    );
}
