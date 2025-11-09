// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Get full user object for metadata
    const user = await currentUser();
    const userType = user?.publicMetadata?.userType as string ?? user?.unsafeMetadata?.userType as string ?? '';
    const onboardingComplete = user?.publicMetadata?.onboardingComplete as boolean ?? user?.unsafeMetadata?.onboardingComplete as boolean ?? false;

    if (!onboardingComplete) {
        redirect('/onboarding');
    }

    // Route based on user type
    if (userType === 'professional') {
        redirect('/professional/dashboard');
    } else if (userType === 'hr-partner') {
        redirect('/dashboard/hr-partner');
    }

    // Fallback for unknown user types
    redirect('/onboarding');

    return (
        <div className="p-6">
            <h1 className="text-2xl">Welcome, {user?.firstName || 'User'} 👋</h1>
            <p>Redirecting...</p>
        </div>
    )
}
