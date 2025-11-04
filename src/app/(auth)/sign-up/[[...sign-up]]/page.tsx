'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const initialUserType = (typeParam === 'professional' || typeParam === 'hr_partner') ? typeParam : null;

    const [selectedUserType, setSelectedUserType] = useState<'professional' | 'hr_partner'>(
        initialUserType || 'professional'
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md w-full">
                {/* User Type Selection */}
                <div className="mb-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-primary mb-2">theNexus</h1>
                        <p className="text-gray-600">Where Nigeria&apos;s Top Talent Meets Visionary Leaders</p>
                    </div>

                    <h2 className="text-xl font-bold text-secondary mb-4 text-center">
                        Choose Your Account Type
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Professional Card */}
                        <button
                            onClick={() => setSelectedUserType('professional')}
                            className={`p-6 border-2 rounded-xl transition-all duration-200 ${selectedUserType === 'professional'
                                ? 'border-primary bg-green-50 shadow-lg scale-105'
                                : 'border-gray-300 hover:border-primary hover:shadow-md'
                                }`}
                        >
                            <div className="text-4xl mb-3">👤</div>
                            <div className="font-semibold text-secondary mb-1">Professional</div>
                            <div className="text-xs text-gray-600">Find opportunities</div>
                            {selectedUserType === 'professional' && (
                                <div className="mt-3">
                                    <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full">
                                        Selected ✓
                                    </span>
                                </div>
                            )}
                        </button>

                        {/* HR Partner Card */}
                        <button
                            onClick={() => setSelectedUserType('hr_partner')}
                            className={`p-6 border-2 rounded-xl transition-all duration-200 ${selectedUserType === 'hr_partner'
                                ? 'border-secondary bg-blue-50 shadow-lg scale-105'
                                : 'border-gray-300 hover:border-secondary hover:shadow-md'
                                }`}
                        >
                            <div className="text-4xl mb-3">🏢</div>
                            <div className="font-semibold text-secondary mb-1">Company/HR</div>
                            <div className="text-xs text-gray-600">Hire talent</div>
                            {selectedUserType === 'hr_partner' && (
                                <div className="mt-3">
                                    <span className="inline-block bg-secondary text-white text-xs px-3 py-1 rounded-full">
                                        Selected ✓
                                    </span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Clerk Sign-Up Component */}
                <SignUp
                    appearance={{
                        variables: {
                            colorPrimary: selectedUserType === 'professional' ? '#2E8B57' : '#0A2540',
                            colorBackground: '#ffffff',
                            colorText: '#0A2540',
                            colorTextSecondary: '#666666',
                            colorInputBackground: '#ffffff',
                            colorInputText: '#0A2540',
                            borderRadius: '8px',
                            fontFamily: 'Manrope, -apple-system, system-ui, sans-serif',
                        },
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'shadow-xl rounded-xl',
                            headerTitle: 'text-[#0A2540] text-xl font-bold',
                            headerSubtitle: 'text-gray-600',
                            socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                            formButtonPrimary:
                                selectedUserType === 'professional'
                                    ? 'bg-[#2E8B57] hover:bg-[#1F5F3F]'
                                    : 'bg-[#0A2540] hover:bg-[#1A3A52]',
                            formFieldLabel: 'text-[#0A2540] font-medium',
                            formFieldInput: 'border-gray-300 focus:border-[#2E8B57]',
                            footerActionLink: 'text-[#2E8B57] hover:text-[#1F5F3F]',
                        },
                    }}
                    // CRITICAL: Set initial metadata during sign-up
                    unsafeMetadata={{
                        userType: selectedUserType,
                        onboardingComplete: false,
                        verified: false,
                        verificationLevel: null,
                    }}
                />

                {/* Info Banner */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 text-blue-500 text-xl">ℹ️</div>
                        <div className="text-sm text-blue-800">
                            <strong>Next Step:</strong> After sign-up, you&apos;ll complete your profile to unlock
                            {selectedUserType === 'professional'
                                ? ' access to top companies'
                                : ' the ability to search for talent'}
                            .
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}