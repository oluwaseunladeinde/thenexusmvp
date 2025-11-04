import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/database';
import { syncUserToDatabase } from '../actions/sync-user';

export default async function OnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Check if already onboarded
    const onboardingComplete = user.publicMetadata?.onboardingComplete as boolean;
    if (onboardingComplete) {
        redirect('/dashboard');
    }

    // Get user type
    const userType = user.publicMetadata?.userType as string;

    // Check if user exists in Prisma
    let prismaUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (user && !prismaUser) {
        const data = await syncUserToDatabase();
        if (data.user) {
            prismaUser = data?.user;
        }
    }

    if (!prismaUser) {
        // User not yet synced from webhook - show loading
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Setting up your account...</p>
                </div>
            </div>
        );
    }

    // Route to appropriate onboarding flow
    if (userType === 'professional') {
        redirect('/onboarding/professional');
    } else if (userType === 'hr_partner') {
        redirect('/onboarding/hr-partner');
    } else {
        // Unknown user type - show error
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">Invalid user type. Please contact support.</p>
                </div>
            </div>
        );
    }
}