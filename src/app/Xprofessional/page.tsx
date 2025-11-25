"use client";

import React from 'react'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProfessionalLandingPage = () => {
    const { user } = useUser();
    const router = useRouter();

    // Client-side authentication check
    useEffect(() => {
        if (!user) {
            router.push('/sign-in');
            return;
        }

        const userType = (user.publicMetadata?.userType as string | undefined) ?? '';
        const normalizedUserType = userType.toLowerCase();
        const allowedTypes = ['professional', 'hr-partner', 'admin'];

        if (!allowedTypes.includes(normalizedUserType)) {
            router.push('/sign-in');
            return;
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <div>ProfessionalLandingPage</div>
    )
}

export default ProfessionalLandingPage
