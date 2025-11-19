'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Users, Target, Loader2 } from 'lucide-react';
import { HrOnboardingData } from '../HrOnboardingWizard';

const step3Schema = z.object({
    hiringTimeline: z.string().min(1, 'Please select your hiring timeline'),
    numberOfRoles: z.string().min(1, 'Please select number of roles'),
    teamSize: z.string().min(1, 'Please select your team size'),
});

type Step3Data = z.infer<typeof step3Schema>;

interface Props {
    data: HrOnboardingData;
    onChange: (data: HrOnboardingData) => void;
    onValidation: (isValid: boolean) => void;
    onSubmit: () => void;
    loading: boolean;
}

const hiringTimelines = [
    'Immediately (within 1 month)',
    'Short term (1-3 months)',
    'Medium term (3-6 months)',
    'Long term (6+ months)',
    'Just exploring options'
];

const numberOfRolesOptions = [
    '1-2 roles',
    '3-5 roles',
    '6-10 roles',
    '11-20 roles',
    '20+ roles'
];

const teamSizeOptions = [
    'Just me',
    '2-5 people',
    '6-15 people',
    '16-50 people',
    '50+ people'
];

export function HrStep3HiringPlans({ data, onChange, onValidation, onSubmit, loading }: Props) {
    const form = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            hiringTimeline: data.hiringTimeline,
            numberOfRoles: data.numberOfRoles,
            teamSize: data.teamSize,
        },
        mode: 'onChange',
    });

    const { watch, formState: { isValid } } = form;
    const watchedValues = watch();
    const serializedWatchedValues = JSON.stringify(watchedValues);
    const lastSerializedValuesRef = useRef(serializedWatchedValues);

    // Update parent data when form values change
    useEffect(() => {
        if (serializedWatchedValues !== lastSerializedValuesRef.current) {
            lastSerializedValuesRef.current = serializedWatchedValues;
            onChange({
                ...data,
                ...JSON.parse(serializedWatchedValues),
            });
        }
    }, [serializedWatchedValues, data, onChange]);


    // Update validation status
    useEffect(() => {
        onValidation(isValid);
    }, [isValid, onValidation]);

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-6 dark:text-gray-400">
                Help us understand your hiring needs so we can provide the best experience.
            </div>

            <Form {...form}>
                <FormField
                    control={form.control}
                    name="hiringTimeline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="dark:text-gray-200">When are you looking to hire? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue placeholder="Select timeline" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                    {hiringTimelines.map((timeline) => (
                                        <SelectItem key={timeline} value={timeline} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                            {timeline}
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
                    name="numberOfRoles"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="dark:text-gray-200">How many roles are you planning to fill? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue placeholder="Select number of roles" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                    {numberOfRolesOptions.map((option) => (
                                        <SelectItem key={option} value={option} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                            {option}
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
                    name="teamSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="dark:text-gray-200">What's your current team size? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue placeholder="Select team size" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                    {teamSizeOptions.map((option) => (
                                        <SelectItem key={option} value={option} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </Form>

            {/* What Happens Next Info Box */}
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CardHeader>
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        What happens next?
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 space-y-3 dark:text-green-300">
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">14-day free trial</p>
                            <p className="text-sm">Full access to all features, no credit card required</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">5 introduction credits</p>
                            <p className="text-sm">Connect with up to 5 senior professionals immediately</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">Dedicated support</p>
                            <p className="text-sm">Our team will help you get started and find the right talent</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
                onClick={onSubmit}
                disabled={!isValid || loading}
                className="w-full"
                size="lg"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating your profile...
                    </>
                ) : (
                    'Complete Setup & Start Hiring'
                )}
            </Button>
        </div>
    );
}
