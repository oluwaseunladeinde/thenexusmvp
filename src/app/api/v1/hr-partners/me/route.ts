import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/hr-partners/me:
 *   get:
 *     summary: Get current HR partner profile
 *     tags: [HR Partners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: HR partner profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: HR partner profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            include: {
                company: true,
                user: {
                    select: {
                        email: true,
                        phone: true,
                        phoneVerified: true,
                        emailVerified: true,
                    },
                }
            },
        });

        if (!hrPartner) {
            // Check if user exists in database at all
            const user = await prisma.user.findUnique({
                where: { clerkUserId: userId },
                select: { id: true, userType: true, email: true }
            });

            return NextResponse.json(
                {
                    error: 'HR partner profile not found',
                    details: 'User may not have completed HR partner onboarding or may be a professional',
                    userId: userId,
                    userRecord: user
                },
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

        return NextResponse.json({
            message: 'HR partner profile retrieved successfully',
            data: {
                hrPartner: {
                    ...hrPartner,
                    company: hrPartner.company,
                },
                stats: {
                    activeJobs: activeJobsCount,
                    totalIntroductions,
                    pendingIntroductions,
                    completedIntroductions,
                    introductionCredits,
                },
                trial: {
                    expiresAt: hrPartner.company?.subscriptionExpiresAt || null,
                    introductionCredits,
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Fetch HR partner profile error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
