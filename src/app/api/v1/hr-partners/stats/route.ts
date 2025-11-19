import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/hr-partners/stats:
 *   get:
 *     summary: Get HR partner dashboard statistics
 *     tags: [HR Partners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: HR partner statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: HR partner not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get HR partner with company info
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            include: {
                company: true,
            }
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR partner not found' },
                { status: 404 }
            );
        }

        // Get active jobs count
        const activeJobsCount = await prisma.jobRole.count({
            where: {
                companyId: hrPartner.companyId,
                status: 'ACTIVE',
            }
        });

        // Get total introductions requested
        const totalIntroductions = await prisma.introductionRequest.count({
            where: {
                sentByHrId: hrPartner.id,
            }
        });

        // Get pending introductions
        const pendingIntroductions = await prisma.introductionRequest.count({
            where: {
                sentByHrId: hrPartner.id,
                status: 'PENDING',
            }
        });

        // Get completed introductions
        const completedIntroductions = await prisma.introductionRequest.count({
            where: {
                sentByHrId: hrPartner.id,
                status: 'ACCEPTED',
            }
        });

        // Get introduction credits remaining
        const introductionCredits = hrPartner.company?.introductionCredits || 0;

        // Get recent matches (introduction requests with status updates)
        const recentMatches = await prisma.introductionRequest.findMany({
            where: {
                sentByHrId: hrPartner.id,
            },
            include: {
                jobRole: {
                    select: {
                        roleTitle: true,
                        locationCity: true,
                        locationState: true,
                    }
                },
                professional: {
                    select: {
                        firstName: true,
                        lastName: true,
                        currentTitle: true,
                        currentCompany: true,
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 5,
        });

        const stats = {
            activeJobs: activeJobsCount,
            totalIntroductions,
            pendingIntroductions,
            completedIntroductions,
            introductionCredits,
            recentMatches: recentMatches.map(match => ({
                id: match.id,
                status: match.status,
                jobTitle: match.jobRole?.roleTitle || 'Unknown',
                jobLocation: match.jobRole?.locationCity && match.jobRole?.locationState
                    ? `${match.jobRole.locationCity}, ${match.jobRole.locationState}`
                    : 'Unknown',
                professionalName: `${match.professional?.firstName || ''} ${match.professional?.lastName || ''}`.trim() || 'Unknown',
                professionalTitle: match.professional?.currentTitle || null,
                professionalCompany: match.professional?.currentCompany || null,
                updatedAt: match.updatedAt,
            })),
            trialEndsAt: hrPartner.company?.subscriptionExpiresAt || null,
        };

        return NextResponse.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching HR partner stats:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && { details: error instanceof Error ? error.message : 'Unknown error' })
            },
            { status: 500 }
        );
    }
}
