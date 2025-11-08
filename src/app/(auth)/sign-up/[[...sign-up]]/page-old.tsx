'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {

    const searchParams = useSearchParams();
    const userType = searchParams.get('type') || 'professional';


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full items-center justify-center">
                {/* User Type Selection BEFORE Sign-Up Form */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                        Choose Your Account Type
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Link href="/sign-up?type=professional"
                            className={`p-4 border-2 rounded-md transition ${userType === 'professional'
                                ? 'border-primary bg-green-50'
                                : 'border-gray-300 hover:border-primary'
                                }`}
                        >
                            <div className="text-3xl mb-2">👤</div>
                            <div className="font-semibold">Professional</div>
                            <div className="text-xs text-gray-600">Find opportunities</div>
                        </Link>

                        <Link href="/sign-up?type=HR_PARTNER"
                            className={`p-4 border-2 rounded-md transition ${userType === 'hr-partner'
                                ? 'border-secondary bg-blue-50'
                                : 'border-gray-300 hover:border-secondary'
                                }`}
                        >
                            <div className="text-3xl mb-2">🏢</div>
                            <div className="font-semibold">Company/HR</div>
                            <div className="text-xs text-gray-600">Hire talent</div>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        appearance={{
                            variables: {
                                colorPrimary: userType === 'professional' ? '#2E8B57' : '#0A2540',
                            },
                        }}
                        // CRITICAL: Set user type in metadata during sign-up
                        unsafeMetadata={{
                            userType: userType,
                            onboardingComplete: false,
                            hasDualRole: false,
                        }}
                    />
                </div>

            </div>
        </div>
    )
}
