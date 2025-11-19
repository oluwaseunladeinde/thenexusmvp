import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export enum SubscriptionTier {
    TRIAL = 'TRIAL',
    BASIC = 'BASIC',
    PROFESSIONAL = 'PROFESSIONAL',
    ENTERPRISE = 'ENTERPRISE'
}

export interface SubscriptionInfo {
    tier: SubscriptionTier;
    isActive: boolean;
    expiresAt: Date | null;
    hasAiFeatures: boolean;
    creditsRemaining: number;
}

/**
 * Get subscription information for the current user's company
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo | null> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        // Get HR partner to find company
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: {
                company: {
                    select: {
                        subscriptionTier: true,
                        subscriptionExpiresAt: true,
                        introductionCredits: true,
                    }
                }
            }
        });

        if (!hrPartner?.company) {
            return null;
        }

        const company = hrPartner.company;
        const now = new Date();
        const isActive = !company.subscriptionExpiresAt || company.subscriptionExpiresAt > now;

        // AI features available for Professional and Enterprise tiers
        const hasAiFeatures = [SubscriptionTier.PROFESSIONAL, SubscriptionTier.ENTERPRISE].includes(
            company.subscriptionTier as SubscriptionTier
        );

        return {
            tier: company.subscriptionTier as SubscriptionTier,
            isActive,
            expiresAt: company.subscriptionExpiresAt,
            hasAiFeatures,
            creditsRemaining: company.introductionCredits,
        };
    } catch (error) {
        console.error('Error fetching subscription info:', error);
        return null;
    }
}

/**
 * Check if user has access to AI features
 */
export async function hasAiFeatures(): Promise<boolean> {
    const subscription = await getSubscriptionInfo();
    return subscription?.hasAiFeatures ?? false;
}

/**
 * Check if subscription is active
 */
export async function isSubscriptionActive(): Promise<boolean> {
    const subscription = await getSubscriptionInfo();
    return subscription?.isActive ?? false;
}
