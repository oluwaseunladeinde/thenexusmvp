'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { completeProfessionalOnboarding } from '@/app/actions/clerk-metadata';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
    userId: string;
    userEmail: string;
}

export default function ProfessionalOnboardingForm({ userId, userEmail }: Props) {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        profileHeadline: '',
        locationCity: '',
        locationState: '',
        yearsOfExperience: 5,
        currentTitle: '',
        currentCompany: '',
        currentIndustry: '',
        salaryExpectationMin: '',
        salaryExpectationMax: '',
        linkedinUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create professional profile
            const response = await fetch('/api/professionals/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    ...formData,
                    yearsOfExperience: parseInt(formData.yearsOfExperience as any),
                    salaryExpectationMin: formData.salaryExpectationMin
                        ? parseInt(formData.salaryExpectationMin)
                        : undefined,
                    salaryExpectationMax: formData.salaryExpectationMax
                        ? parseInt(formData.salaryExpectationMax)
                        : undefined,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create profile');
            }

            const data = await response.json();

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

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-secondary">Step {step} of 3</span>
                    <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-secondary mb-4">Basic Information</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm font-medium text-secondary mb-2">
                                First Name *
                            </Label>
                            <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-secondary mb-2">
                                Last Name *
                            </Label>
                            <Input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-secondary mb-2">
                            Professional Headline *
                        </Label>
                        <Input
                            type="text"
                            name="profileHeadline"
                            value={formData.profileHeadline}
                            onChange={handleChange}
                            placeholder="e.g., Senior Product Manager | Fintech | 10+ Years Experience"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm font-medium text-secondary mb-2">City *</Label>
                            <select
                                name="locationCity"
                                value={formData.locationCity}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">Select city</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja</option>
                                <option value="Port Harcourt">Port Harcourt</option>
                                <option value="Kano">Kano</option>
                            </select>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-secondary mb-2">State *</Label>
                            <select
                                name="locationState"
                                value={formData.locationState}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">Select state</option>
                                <option value="Lagos">Lagos</option>
                                <option value="FCT">FCT (Abuja)</option>
                                <option value="Rivers">Rivers</option>
                                <option value="Kano">Kano</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full bg-primary text-white py-3 rounded-sm font-semibold hover:bg-[#1F5F3F] transition"
                    >
                        Continue →
                    </button>
                </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-secondary mb-4">Professional Experience</h2>

                    <div>
                        <Label className="block text-sm font-medium text-secondary mb-2">
                            Years of Experience *
                        </Label>
                        <Input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            min="5"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm font-medium text-secondary mb-2">
                                Current Title *
                            </Label>
                            <Input
                                type="text"
                                name="currentTitle"
                                value={formData.currentTitle}
                                onChange={handleChange}
                                placeholder="e.g., Director of Operations"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-secondary mb-2">
                                Current Company
                            </Label>
                            <Input
                                type="text"
                                name="currentCompany"
                                value={formData.currentCompany}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-secondary mb-2">Industry *</Label>
                        <select
                            name="currentIndustry"
                            value={formData.currentIndustry}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Select industry</option>
                            <option value="Financial Services">Financial Services</option>
                            <option value="Technology">Technology</option>
                            <option value="Oil & Gas">Oil & Gas</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-sm font-semibold hover:bg-gray-300 transition"
                        >
                            ← Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="flex-1 bg-primary text-white py-3 rounded-sm font-semibold hover:bg-[#1F5F3F] transition"
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Expectations */}
            {step === 3 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-secondary mb-4">Career Expectations</h2>

                    <div>
                        <Label className="block text-sm font-medium text-secondary mb-2">
                            Expected Salary Range (Annual, Naira)
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                name="salaryExpectationMin"
                                value={formData.salaryExpectationMin}
                                onChange={handleChange}
                                placeholder="Minimum"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <Input
                                type="number"
                                name="salaryExpectationMax"
                                value={formData.salaryExpectationMax}
                                onChange={handleChange}
                                placeholder="Maximum"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-secondary mb-2">
                            LinkedIn Profile URL
                        </Label>
                        <Input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-2">🎉 Almost Done!</h3>
                        <p className="text-sm text-green-800">
                            After completing onboarding, you can add work history, education, and upload your CV
                            to increase your profile visibility.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#1F5F3F] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Profile...' : 'Complete Onboarding ✓'}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}