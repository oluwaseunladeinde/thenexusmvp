import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HrOnboardingWizard from '@/components/onboarding/HrOnboardingWizard';

export default async function HrPartnerOnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Get user type
    const userType = user.publicMetadata?.userType as string ?? user.unsafeMetadata?.userType as string ?? '';
    if (userType !== 'hr-partner') {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary mb-2 dark:text-gray-300">
                        Welcome to theNexus {user.firstName ? `, ${user.firstName}` : ''}!
                    </h1>
                    <p className="text-muted-foreground">Set up your company profile to start hiring</p>
                </div>

                <HrOnboardingWizard
                    userId={user.id}
                    userEmail={user.emailAddresses[0]?.emailAddress ?? ''}
                />
            </div>
        </div>
    );
}