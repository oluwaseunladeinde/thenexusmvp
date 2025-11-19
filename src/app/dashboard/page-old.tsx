// app/dashboard/page-old.tsx
import RoleSwitcher from '@/components/platform/RoleSwitcher';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Type-safe access to metadata
    const userType = sessionClaims?.metadata?.userType ?? 'Unknown';
    const hasDualRole = sessionClaims?.metadata?.hasDualRole ?? false;

    // Get full user object for more metadata
    const user = await currentUser();
    const onboardingComplete = user?.publicMetadata?.onboardingComplete === true;

    if (!onboardingComplete) {
        redirect('/onboarding');
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl">Welcome, {user?.firstName || 'User'} 👋</h1>
            <p>User Type: {userType}</p>
            {hasDualRole && <RoleSwitcher />}
        </div>
    )
}
