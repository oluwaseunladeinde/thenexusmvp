import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProfessionalOnboardingForm from '@/components/onboarding/ProfessionalOnboardingForm';
import { auth } from '@clerk/nextjs/server';

export default async function ProfessionalOnboardingPage() {
    const user = await currentUser();
    const { userId } = await auth();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    console.log({ user, userId });

    const userType = user.unsafeMetadata?.userType as string;
    console.log("professional onboarding ", { userType });
    if (userType !== 'professional') {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Welcome to theNexus, {user.firstName}!
                    </h1>
                    <p className="text-gray-600">Complete your profile to start receiving opportunities</p>
                </div>

                <ProfessionalOnboardingForm userId={user.id} userEmail={user.emailAddresses[0].emailAddress} />
            </div>
        </div>
    );
}