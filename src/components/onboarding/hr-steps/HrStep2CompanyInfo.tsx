'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, Building2 } from 'lucide-react';
import { HrOnboardingData } from '../HrOnboardingWizard';

const step2Schema = z.object({
    companyName: z.string().min(2, 'Company name is required'),
    industry: z.string().min(1, 'Please select an industry'),
    companySize: z.string().min(1, 'Please select company size'),
    companyWebsite: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
    companyDescription: z.string().min(10, 'Please provide a brief company description (at least 10 characters)'),
    headquartersLocation: z.string().min(2, 'Headquarters location is required'),
});

type Step2Data = z.infer<typeof step2Schema>;

interface Props {
    data: HrOnboardingData;
    onChange: (data: HrOnboardingData) => void;
    onValidation: (isValid: boolean) => void;
}

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media & Entertainment',
    'Real Estate',
    'Transportation',
    'Energy',
    'Government',
    'Non-profit',
    'Other'
];

const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1001-5000 employees',
    '5000+ employees'
];

export function HrStep2CompanyInfo({ data, onChange, onValidation }: Props) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            companyName: data.companyName,
            industry: data.industry,
            companySize: data.companySize,
            companyWebsite: data.companyWebsite,
            companyDescription: data.companyDescription,
            headquartersLocation: data.headquartersLocation,
        },
        mode: 'onChange',
    });

    const { watch, formState: { isValid } } = form;
    const watchedValues = watch();

    // Update parent data when form values change
    useEffect(() => {
        onChange({
            ...data,
            ...watchedValues,
            companyLogoUrl: logoFile ? 'pending-upload' : undefined,
        });
    }, [watchedValues, logoFile, data, onChange]);

    // Update validation status
    useEffect(() => {
        onValidation(isValid);
    }, [isValid, onValidation]);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-6 dark:text-gray-400">
                Tell us about your company. This information helps professionals understand your organization.
            </div>

            <Form {...form}>
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="dark:text-gray-200">Company Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Acme Corporation" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                                <FormLabel className="dark:text-gray-200">Industry *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                        {industries.map((industry) => (
                                            <SelectItem key={industry} value={industry} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                                {industry}
                                            </SelectItem>
                                        ))}
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
                                <FormLabel className="dark:text-gray-200">Company Size *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                        {companySizes.map((size) => (
                                            <SelectItem key={size} value={size} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                                {size}
                                            </SelectItem>
                                        ))}
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
                            <FormLabel className="dark:text-gray-200">Company Website (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://www.company.com" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                            <FormLabel className="dark:text-gray-200">Headquarters Location *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Lagos, Nigeria" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
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
                            <FormLabel className="dark:text-gray-200">Company Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of your company, what you do, and your mission..."
                                    className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Company Logo Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-gray-200">Company Logo (Optional)</label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                                className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {logoFile ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                        </div>
                        {logoPreview && (
                            <div className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center dark:bg-gray-600 dark:border-gray-500">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        {!logoPreview && (
                            <div className="w-16 h-16 border rounded-lg bg-gray-50 flex items-center justify-center dark:bg-gray-600 dark:border-gray-500">
                                <Building2 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}
