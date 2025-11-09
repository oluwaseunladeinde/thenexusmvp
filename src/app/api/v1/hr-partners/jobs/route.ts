import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/hr-partners/jobs:
 *   get:
 *     summary: Get HR partner's jobs
 *     tags: [HR Partners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
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

        // Get HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId }
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR partner not found' },
                { status: 404 }
            );
        }

        // Get jobs for the company
        const jobs = await prisma.jobRole.findMany({
            where: {
                companyId: hrPartner.companyId,
            },
            include: {
                _count: {
                    select: {
                        introductionRequests: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedJobs = jobs.map(job => ({
            id: job.id,
            title: job.roleTitle,
            location: `${job.locationCity}, ${job.locationState}`,
            employmentType: job.employmentType,
            experienceLevel: job.seniorityLevel,
            salaryRange: `$${job.salaryRangeMin.toLocaleString()} - $${job.salaryRangeMax.toLocaleString()}`,
            status: job.status,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            introductionRequestsCount: job._count.introductionRequests,
        }));

        return NextResponse.json({
            success: true,
            data: formattedJobs
        });

    } catch (error) {
        console.error('Error fetching HR partner jobs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
