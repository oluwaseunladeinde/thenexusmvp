import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HrPartnerOnboardingForm from '@/components/onboarding/HrPartnerOnboardingForm';

export default async function HrPartnerOnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const userType = user.publicMetadata?.userType as string;
    if (userType !== 'hr_partner') {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary mb-2">
                        Welcome to theNexus {user.firstName ? `, ${user.firstName}` : ''}!
                    </h1>
                    <p className="text-gray-600">Set up your company profile to start hiring</p>
                </div>

                <HrPartnerOnboardingForm
                    userId={user.id}
                    userEmail={user.emailAddresses[0]?.emailAddress ?? ''}
                />
            </div>
        </div>
    );
}