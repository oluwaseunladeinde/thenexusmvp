import React, { ReactNode } from 'react';
import DashboardNavBar from '@/components/professional/dashboard/DashboardNavBar';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {

    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    const userType = (user.publicMetadata?.userType as string | undefined) ?? '';
    if (userType !== 'PROFESSIONAL' && userType !== 'HR_LEADER' &&
        userType !== 'professional' && userType !== 'hr-partner') {
        redirect('/sign-in');
    }

    return (
        <div className='min-h-screen bg-gray-200 dark:bg-gray-900'>
            {/* Header */}
            <DashboardNavBar userType={userType} />

            {/* Main Content */}
            <main className="bg-gray-100 dark:bg-gray-900">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout;
