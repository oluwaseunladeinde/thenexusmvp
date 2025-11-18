import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            return NextResponse.json({
                tier: 'TRIAL',
                isActive: true,
                expiresAt: null,
                hasAiFeatures: false,
                creditsRemaining: 0,
            });
        }

        const company = hrPartner.company;
        const now = new Date();
        const isActive = !company.subscriptionExpiresAt || company.subscriptionExpiresAt > now;

        // AI features available for Professional and Enterprise tiers
        const hasAiFeatures = ['PROFESSIONAL', 'ENTERPRISE'].includes(company.subscriptionTier);

        return NextResponse.json({
            tier: company.subscriptionTier,
            isActive,
            expiresAt: company.subscriptionExpiresAt,
            hasAiFeatures,
            creditsRemaining: company.introductionCredits,
        });
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
