'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

/**
 * Update user metadata (both public and unsafe)
 * Must be called from server-side only
 */
export async function updateUserMetadata(data: {
    unsafeMetadata?: Record<string, any>;
    publicMetadata?: Record<string, any>;
    privateMetadata?: Record<string, any>;
}) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    try {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: data.unsafeMetadata,
            publicMetadata: data.publicMetadata,
            privateMetadata: data.privateMetadata,
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating user metadata:', error);
        throw new Error(error.message || 'Failed to update metadata');
    }
}

/**
 * Complete onboarding for a professional
 */
export async function completeProfessionalOnboarding() {
    return await updateUserMetadata({
        unsafeMetadata: {
            onboardingComplete: true,
            verified: false,
            verificationLevel: null,
        },
        publicMetadata: {
            userType: 'professional',
            onboardingComplete: true,
            verified: false,
        },
    });
}

/**
 * Complete onboarding for an HR partner
 */
export async function completeHrPartnerOnboarding(data: {
    hasDualRole: boolean;
    hrPartnerId: string;
    companyId: string;
    professionalId?: string;
}) {
    if (data.hasDualRole && !data.professionalId) {
        throw new Error('professionalId is required when hasDualRole is true');
    }

    return await updateUserMetadata({
        unsafeMetadata: {
            onboardingComplete: true,
            hasDualRole: data.hasDualRole,
            activeRole: 'hr',
        },
        publicMetadata: {
            userType: 'hr-partner',
            onboardingComplete: true,
            hasDualRole: data.hasDualRole,
            activeRole: 'hr',
        },
        privateMetadata: {
            hrPartnerId: data.hrPartnerId,
            companyId: data.companyId,
            professionalId: data.professionalId || null,
        },
    });
}

/**
 * Switch active role for dual-role users
 */
export async function switchActiveRole(activeRole: 'hr' | 'professional') {

    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    if (!user.unsafeMetadata?.hasDualRole) {
        throw new Error('User does not have dual role capability');
    }

    return await updateUserMetadata({
        unsafeMetadata: {
            activeRole,
        },
        publicMetadata: {
            activeRole,
        },
    });
}