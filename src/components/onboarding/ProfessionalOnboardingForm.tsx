'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfessionalOnboarding } from '@/app/actions/clerk-metadata';
import { professionalOnboardingSchema, type ProfessionalOnboardingData } from '@/lib/schemas/professional-onboarding';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface Props {
    userId: string;
    userEmail: string;
}

interface State {
    id: string;
    name: string;
    code: string;
}

interface City {
    id: string;
    name: string;
}

export default function ProfessionalOnboardingForm({ userId, userEmail }: Props) {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    const form = useForm<ProfessionalOnboardingData>({
        resolver: zodResolver(professionalOnboardingSchema) as any,
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            profileHeadline: '',
            locationCity: '',
            locationState: '',
            yearsOfExperience: 5,
            currentTitle: '',
            currentCompany: '',
            currentIndustry: '',
            salaryExpectationMin: undefined,
            salaryExpectationMax: undefined,
            noticePeriod: '1_month',
            willingToRelocate: false,
            openToOpportunities: true,
            skills: [],
            linkedinUrl: '',
            portfolioUrl: '',
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        control,
        formState: { errors },
    } = form;

    const selectedState = watch('locationState');
    const skills = watch('skills') || [];

    // Fetch states on mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch('/api/v1/states');
                if (response.ok) {
                    const data = await response.json();
                    setStates(data);
                }
            } catch (error) {
                console.error('Error fetching states:', error);
            } finally {
                setLoadingStates(false);
            }
        };

        fetchStates();
    }, []);

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const response = await fetch(`/api/v1/states/${selectedState}/cities`);
                if (response.ok) {
                    const data = await response.json();
                    setCities(data);
                    // Reset city selection when state changes
                    setValue('locationCity', '');
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, [selectedState, setValue]);

    const onSubmit = async (data: ProfessionalOnboardingData) => {
        setLoading(true);

        try {
            // Create professional profile
            const response = await fetch('/api/v1/professionals/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    ...data,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create profile');
            }

            // Update Clerk metadata to mark onboarding as complete
            await completeProfessionalOnboarding();

            // Redirect to dashboard
            router.push('/professional/dashboard?welcome=true');
        } catch (error: any) {
            console.error('Onboarding error:', error);
            alert(error.message || 'Failed to complete onboarding');
        } finally {
            setLoading(false);
        }
    };

    const validateStep = async (stepNumber: number) => {
        let fieldsToValidate: (keyof ProfessionalOnboardingData)[] = [];

        switch (stepNumber) {
            case 1:
                fieldsToValidate = ['firstName', 'lastName', 'profileHeadline', 'locationState', 'locationCity'];
                break;
            case 2:
                fieldsToValidate = ['yearsOfExperience', 'currentTitle', 'currentIndustry'];
                break;
            case 3:
                // All fields are optional in step 3, but we can validate salary range logic
                const min = watch('salaryExpectationMin');
                const max = watch('salaryExpectationMax');
                if (min && max && min >= max) {
                    alert('Maximum salary must be greater than minimum salary');
                    return false;
                }
                return true;
            default:
                return false;
        }

        const isStepValid = await trigger(fieldsToValidate);
        return isStepValid;
    };

    const handleNext = async () => {
        const isValid = await validateStep(step);
        if (isValid) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8 border border-transparent dark:bg-gray-800 dark:border-gray-700">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-secondary dark:text-gray-300">Step {step} of 3</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((step / 3) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-secondary mb-4 dark:text-gray-100">Basic Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">First Name *</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">Last Name *</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name="profileHeadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-gray-200">Professional Headline *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g., Senior Product Manager | Fintech | 10+ Years Experience"
                                            className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="locationState"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">State *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={loadingStates}>
                                            <FormControl>
                                                <SelectTrigger className="w-full rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                                    <SelectValue placeholder={loadingStates ? 'Loading states...' : 'Select state'} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                                {states.map((state) => (
                                                    <SelectItem key={state.id} value={state.id} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                                        {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="locationCity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">City *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState || loadingCities}>
                                            <FormControl>
                                                <SelectTrigger className="w-full rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                                    <SelectValue
                                                        placeholder={
                                                            !selectedState
                                                                ? 'Select state first'
                                                                : loadingCities
                                                                    ? 'Loading cities...'
                                                                    : 'Select city'
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                                {cities.map((city) => (
                                                    <SelectItem key={city.id} value={city.id} className="dark:text-gray-100 dark:focus:bg-gray-600">
                                                        {city.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-full bg-primary text-white py-3 rounded-sm font-semibold hover:bg-[#1F5F3F] transition"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* Step 2: Experience */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-secondary mb-4 dark:text-gray-100">Professional Experience</h2>

                        <FormField
                            control={control}
                            name="yearsOfExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-gray-200">Years of Experience *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                                            min="5"
                                            className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="currentTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">Current Title *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., Director of Operations" className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="currentCompany"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">Current Company</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Optional" className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name="currentIndustry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-gray-200">Industry *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                                <SelectValue placeholder="Select industry" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                            <SelectItem value="Financial Services" className="dark:text-gray-100 dark:focus:bg-gray-600">Financial Services</SelectItem>
                                            <SelectItem value="Technology" className="dark:text-gray-100 dark:focus:bg-gray-600">Technology</SelectItem>
                                            <SelectItem value="Oil & Gas" className="dark:text-gray-100 dark:focus:bg-gray-600">Oil & Gas</SelectItem>
                                            <SelectItem value="Healthcare" className="dark:text-gray-100 dark:focus:bg-gray-600">Healthcare</SelectItem>
                                            <SelectItem value="Manufacturing" className="dark:text-gray-100 dark:focus:bg-gray-600">Manufacturing</SelectItem>
                                            <SelectItem value="Retail" className="dark:text-gray-100 dark:focus:bg-gray-600">Retail</SelectItem>
                                            <SelectItem value="Education" className="dark:text-gray-100 dark:focus:bg-gray-600">Education</SelectItem>
                                            <SelectItem value="Government" className="dark:text-gray-100 dark:focus:bg-gray-600">Government</SelectItem>
                                            <SelectItem value="Other" className="dark:text-gray-100 dark:focus:bg-gray-600">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="noticePeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-gray-200">Notice Period *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                                <SelectValue placeholder="Select notice period" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                            <SelectItem value="immediate" className="dark:text-gray-100 dark:focus:bg-gray-600">Immediate</SelectItem>
                                            <SelectItem value="1_week" className="dark:text-gray-100 dark:focus:bg-gray-600">1 Week</SelectItem>
                                            <SelectItem value="2_weeks" className="dark:text-gray-100 dark:focus:bg-gray-600">2 Weeks</SelectItem>
                                            <SelectItem value="1_month" className="dark:text-gray-100 dark:focus:bg-gray-600">1 Month</SelectItem>
                                            <SelectItem value="2_months" className="dark:text-gray-100 dark:focus:bg-gray-600">2 Months</SelectItem>
                                            <SelectItem value="3_months" className="dark:text-gray-100 dark:focus:bg-gray-600">3 Months</SelectItem>
                                            <SelectItem value="6_months" className="dark:text-gray-100 dark:focus:bg-gray-600">6 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3">
                            <FormField
                                control={control}
                                name="willingToRelocate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="dark:border-gray-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="dark:text-gray-200">Willing to relocate</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="openToOpportunities"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="dark:border-gray-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="dark:text-gray-200">Open to new opportunities</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-sm font-semibold hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 bg-primary text-white py-3 rounded-sm font-semibold hover:bg-[#1F5F3F] transition"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Skills & Links */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-secondary mb-4 dark:text-gray-100">Skills & Portfolio</h2>

                        <FormField
                            control={control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-gray-200">Skills *</FormLabel>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Input
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                placeholder="Add a skill (e.g., React, Project Management)"
                                                className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                                                            setValue('skills', [...skills, skillInput.trim()]);
                                                            setSkillInput('');
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                                                        setValue('skills', [...skills, skillInput.trim()]);
                                                        setSkillInput('');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-primary text-white rounded-sm hover:bg-[#1F5F3F] transition"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm dark:bg-gray-600 dark:text-gray-300"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setValue('skills', skills.filter((_, i) => i !== index));
                                                            }}
                                                            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="linkedinUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">LinkedIn Profile URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                {...field}
                                                placeholder="https://linkedin.com/in/yourprofile"
                                                className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="portfolioUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-gray-200">Portfolio URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                {...field}
                                                placeholder="https://yourportfolio.com"
                                                className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormLabel className="dark:text-gray-200">Expected Salary Range (Annual, Naira)</FormLabel>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <FormField
                                    control={control}
                                    name="salaryExpectationMin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    placeholder="Minimum"
                                                    className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="salaryExpectationMax"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    placeholder="Maximum"
                                                    className="rounded-sm p-5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
                            <h3 className="font-semibold text-green-900 mb-2 dark:text-green-200">🎉 Almost Done!</h3>
                            <p className="text-sm text-green-800 dark:text-green-300">
                                After completing onboarding, you can add work history, education, and upload your CV
                                to increase your profile visibility.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-sm font-semibold hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary text-white py-3 rounded-sm font-semibold hover:bg-[#1F5F3F] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Profile...' : 'Complete Onboarding ✓'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    );
}
