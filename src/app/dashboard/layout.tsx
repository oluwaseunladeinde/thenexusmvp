import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RoleSwitcherWithPrivacy from '@/components/platform/RoleSwitcherWithPrivacy';
import { UserButton } from '@clerk/nextjs';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const onboardingComplete = user.publicMetadata?.onboardingComplete;
    if (onboardingComplete !== true) {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <a href="/" className="text-2xl font-bold text-primary">
                                theNexus
                            </a>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            {/* Role Switcher (only for dual-role users) */}
                            <RoleSwitcherWithPrivacy />

                            {/* User Button */}
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-10 h-10',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}