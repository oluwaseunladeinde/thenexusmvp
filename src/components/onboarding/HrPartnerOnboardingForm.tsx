'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { completeHrPartnerOnboarding } from '@/app/actions/clerk-metadata';

interface Props {
    userId: string;
    userEmail: string;
}

export default function HrPartnerOnboardingForm({ userId, userEmail }: Props) {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        firstName: '',
        lastName: '',
        jobTitle: '',
        department: '',
        linkedinUrl: '',

        // Step 2: Company Info
        companyName: '',
        industry: '',
        companySize: '',
        headquartersLocation: '',
        companyWebsite: '',
        companyDescription: '',

        // Step 3: Optional Dual Role
        wantsDualRole: false,
        professionalData: {
            profileHeadline: '',
            locationCity: '',
            locationState: '',
            yearsOfExperience: 5,
            currentTitle: '',
            currentIndustry: '',
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name.startsWith('professional.')) {
            const professionalField = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                professionalData: {
                    ...prev.professionalData,
                    [professionalField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create HR partner and company
            const response = await fetch('/api/hr-partners/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    jobTitle: formData.jobTitle,
                    department: formData.department,
                    linkedinUrl: formData.linkedinUrl,
                    company: {
                        companyName: formData.companyName,
                        industry: formData.industry,
                        companySize: formData.companySize,
                        headquartersLocation: formData.headquartersLocation,
                        companyWebsite: formData.companyWebsite,
                        companyDescription: formData.companyDescription,
                    },
                    dualRole: formData.wantsDualRole ? formData.professionalData : null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create profile');
            }

            // Get created HR partner and company
            const data = await response.json();

            // Update Clerk metadata
            await completeHrPartnerOnboarding({
                hasDualRole: formData.wantsDualRole,
                hrPartnerId: data.hrPartner.id,
                companyId: data.company.id,
                professionalId: data.professional?.id || null,
            })

            // Redirect based on dual role status
            if (formData.wantsDualRole) {
                router.push('/dashboard?welcome=true&dualRole=true');
            } else {
                router.push('/dashboard?welcome=true');
            }
        } catch (error: any) {
            console.error('Onboarding error:', error);
            alert(error.message || 'Failed to complete onboarding');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 dark:bg-gray-800 dark:border-gray-700">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-secondary dark:text-gray-300">Step {step} of 3</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((step / 3) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step 1: Personal Info */}
            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-secondary mb-4 dark:text-gray-100">Your Information</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">Job Title *</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            placeholder="e.g., HR Manager, Talent Acquisition Lead"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g., Human Resources"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                            LinkedIn Profile URL
                        </label>
                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-[#1A3A52] transition"
                    >
                        Continue →
                    </button>
                </div>
            )}

            {/* Step 2: Company Info */}
            {step === 2 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-secondary mb-4 dark:text-gray-100">Company Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                            Company Name *
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Your company's legal name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">Industry *</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            >
                                <option value="">Select industry</option>
                                <option value="Financial Services">Financial Services</option>
                                <option value="Technology">Technology</option>
                                <option value="Oil & Gas">Oil & Gas</option>
                                <option value="Healthcare">Healthcare</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                Company Size *
                            </label>
                            <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            >
                                <option value="">Select size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                            Headquarters Location *
                        </label>
                        <input
                            type="text"
                            name="headquartersLocation"
                            value={formData.headquartersLocation}
                            onChange={handleChange}
                            placeholder="e.g., Lagos, Nigeria"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                            Company Website *
                        </label>
                        <input
                            type="url"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            placeholder="https://yourcompany.com"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                            Company Description *
                        </label>
                        <textarea
                            name="companyDescription"
                            value={formData.companyDescription}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us what your company does..."
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            ← Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="flex-1 bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-[#1A3A52] transition"
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Dual Role (Optional) */}
            {step === 3 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-secondary mb-4 dark:text-gray-100">One More Thing...</h2>

                    {/* Dual Role Opt-In */}
                    <div className="bg-linear-to-r from-green-50 to-blue-50 border-2 border-primary rounded-lg p-6 dark:from-green-900/20 dark:to-blue-900/20 dark:border-primary">
                        <div className="flex items-start gap-4">
                            <input
                                type="checkbox"
                                id="wantsDualRole"
                                name="wantsDualRole"
                                checked={formData.wantsDualRole}
                                onChange={handleChange}
                                className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary dark:border-gray-600"
                            />
                            <div className="flex-1">
                                <label
                                    htmlFor="wantsDualRole"
                                    className="font-semibold text-secondary cursor-pointer text-lg dark:text-gray-100"
                                >
                                    I'm also open to exploring new opportunities
                                </label>
                                <p className="text-gray-700 mt-2 dark:text-gray-300">
                                    Activate a separate, confidential professional profile to receive introduction
                                    requests from other companies.{' '}
                                    <strong className="text-primary">
                                        Your company will never see this profile.
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Professional Profile Form */}
                    {formData.wantsDualRole && (
                        <div className="space-y-4 p-6 bg-green-50 border-2 border-primary rounded-lg dark:bg-green-900/20 dark:border-primary">
                            <h3 className="text-lg font-bold text-secondary mb-4 dark:text-gray-100">
                                🔒 Your Confidential Job Search Profile
                            </h3>

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 dark:bg-blue-900/20 dark:border-blue-600">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Privacy Guarantee:</strong> Your professional profile is completely
                                    separate from your HR role. Your company cannot see it, search for it, or receive
                                    any alerts about it.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                    Professional Headline *
                                </label>
                                <input
                                    type="text"
                                    name="professional.profileHeadline"
                                    value={formData.professionalData.profileHeadline}
                                    onChange={handleChange}
                                    placeholder="e.g., Senior HR Manager | 8+ Years Experience"
                                    required={formData.wantsDualRole}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">City *</label>
                                    <select
                                        name="professional.locationCity"
                                        value={formData.professionalData.locationCity}
                                        onChange={handleChange}
                                        required={formData.wantsDualRole}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    >
                                        <option value="">Select city</option>
                                        <option value="Lagos">Lagos</option>
                                        <option value="Abuja">Abuja</option>
                                        <option value="Port Harcourt">Port Harcourt</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">State *</label>
                                    <select
                                        name="professional.locationState"
                                        value={formData.professionalData.locationState}
                                        onChange={handleChange}
                                        required={formData.wantsDualRole}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    >
                                        <option value="">Select state</option>
                                        <option value="Lagos">Lagos</option>
                                        <option value="FCT">FCT</option>
                                        <option value="Rivers">Rivers</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    name="professional.yearsOfExperience"
                                    value={formData.professionalData.yearsOfExperience}
                                    onChange={handleChange}
                                    min="5"
                                    required={formData.wantsDualRole}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                    Current Title *
                                </label>
                                <input
                                    type="text"
                                    name="professional.currentTitle"
                                    value={formData.professionalData.currentTitle}
                                    onChange={handleChange}
                                    required={formData.wantsDualRole}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2 dark:text-gray-200">
                                    Industry *
                                </label>
                                <select
                                    name="professional.currentIndustry"
                                    value={formData.professionalData.currentIndustry}
                                    onChange={handleChange}
                                    required={formData.wantsDualRole}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                >
                                    <option value="">Select industry</option>
                                    <option value="Financial Services">Financial Services</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Oil & Gas">Oil & Gas</option>
                                    <option value="Healthcare">Healthcare</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#1F5F3F] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Setting Up...' : 'Complete Onboarding ✓'}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
