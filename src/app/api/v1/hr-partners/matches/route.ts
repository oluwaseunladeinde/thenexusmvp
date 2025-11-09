import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/hr-partners/matches:
 *   get:
 *     summary: Get HR partner's introduction matches
 *     tags: [HR Partners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matches retrieved successfully
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

        // Get introduction requests with professional and job details
        const matches = await prisma.introductionRequest.findMany({
            where: {
                sentByHrId: hrPartner.id,
            },
            include: {
                jobRole: {
                    select: {
                        id: true,
                        roleTitle: true,
                        locationCity: true,
                        locationState: true,
                        employmentType: true,
                        seniorityLevel: true,
                    }
                },
                professional: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        currentTitle: true,
                        currentCompany: true,
                        locationCity: true,
                        locationState: true,
                        linkedinUrl: true,
                        profilePhotoUrl: true,
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        const formattedMatches = matches.map(match => ({
            id: match.id,
            status: match.status,
            message: match.personalizedMessage,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
            job: {
                id: match.jobRole.id,
                title: match.jobRole.roleTitle,
                location: `${match.jobRole.locationCity}, ${match.jobRole.locationState}`,
                employmentType: match.jobRole.employmentType,
                experienceLevel: match.jobRole.seniorityLevel,
            },
            professional: {
                id: match.professional.id,
                name: `${match.professional.firstName} ${match.professional.lastName}`,
                currentTitle: match.professional.currentTitle,
                currentCompany: match.professional.currentCompany,
                location: `${match.professional.locationCity}, ${match.professional.locationState}`,
                linkedinUrl: match.professional.linkedinUrl,
                profileImageUrl: match.professional.profilePhotoUrl,
            }
        }));

        return NextResponse.json({
            success: true,
            data: formattedMatches
        });

    } catch (error) {
        console.error('Error fetching HR partner matches:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
