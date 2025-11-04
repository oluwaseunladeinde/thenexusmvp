import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/introductions/received:
 *   get:
 *     summary: Get introduction requests received by the professional
 *     tags: [Introductions, Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, DECLINED, all]
 *         description: Filter by introduction status (default: all)
 *         example: "PENDING"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Introduction requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Introduction requests retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     introductions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Introduction request ID
 *                           sentToProfessionalId:
 *                             type: string
 *                           sentById:
 *                             type: string
 *                           jobRoleId:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [PENDING, ACCEPTED, DECLINED]
 *                           message:
 *                             type: string
 *                             description: Message from HR partner
 *                           professionalResponse:
 *                             type: string
 *                             nullable: true
 *                           sentAt:
 *                             type: string
 *                             format: date-time
 *                           responseDate:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           expiresAt:
 *                             type: string
 *                             format: date-time
 *                           viewedByProfessional:
 *                             type: boolean
 *                           viewedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           jobRole:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               roleTitle:
 *                                 type: string
 *                               roleDescription:
 *                                 type: string
 *                               seniorityLevel:
 *                                 type: string
 *                               locationCity:
 *                                 type: string
 *                                 nullable: true
 *                               locationState:
 *                                 type: string
 *                                 nullable: true
 *                               salaryRangeMin:
 *                                 type: number
 *                                 nullable: true
 *                               salaryRangeMax:
 *                                 type: number
 *                                 nullable: true
 *                               remoteOption:
 *                                 type: string
 *                               employmentType:
 *                                 type: string
 *                               responsibilities:
 *                                 type: string
 *                                 nullable: true
 *                               requirements:
 *                                 type: string
 *                                 nullable: true
 *                               preferredQualifications:
 *                                 type: string
 *                                 nullable: true
 *                               benefits:
 *                                 type: string
 *                                 nullable: true
 *                               isConfidential:
 *                                 type: boolean
 *                               confidentialReason:
 *                                 type: string
 *                                 nullable: true
 *                           company:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               companyName:
 *                                 type: string
 *                               companyLogoUrl:
 *                                 type: string
 *                                 nullable: true
 *                               industry:
 *                                 type: string
 *                               companySize:
 *                                 type: string
 *                               headquartersLocation:
 *                                 type: string
 *                               companyWebsite:
 *                                 type: string
 *                                 nullable: true
 *                               companyDescription:
 *                                 type: string
 *                           sentBy:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               jobTitle:
 *                                 type: string
 *                               profilePhotoUrl:
 *                                 type: string
 *                                 nullable: true
 *                               linkedinUrl:
 *                                 type: string
 *                                 nullable: true
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - professional access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden: Professional access required"
 *       404:
 *         description: Professional profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Professional profile not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch introduction requests"
 */

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userType = user.unsafeMetadata?.userType as string;
        if (!userType || userType !== 'professional') {
            return NextResponse.json({ error: 'Forbidden: Professional access required' }, { status: 403 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Find professional
        const professional = await prisma.professional.findUnique({
            where: { userId: user.id },
            select: { id: true }
        });

        if (!professional) {
            return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
        }

        // Build where clause
        const whereClause: any = {
            sentToProfessionalId: professional.id
        };

        if (status && status !== 'all') {
            whereClause.status = status.toUpperCase();
        }

        // Get introduction requests with related data
        const [introductions, totalCount] = await Promise.all([
            prisma.introductionRequest.findMany({
                where: whereClause,
                include: {
                    jobRole: {
                        select: {
                            id: true,
                            roleTitle: true,
                            roleDescription: true,
                            seniorityLevel: true,
                            locationCity: true,
                            locationState: true,
                            salaryRangeMin: true,
                            salaryRangeMax: true,
                            remoteOption: true,
                            employmentType: true,
                            isConfidential: true,
                            confidentialReason: true,
                        }
                    },
                    company: {
                        select: {
                            id: true,
                            companyName: true,
                            companyLogoUrl: true,
                            industry: true,
                            companySize: true,
                            headquartersLocation: true,
                        }
                    },
                    sentBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            jobTitle: true,
                            profilePhotoUrl: true,
                        }
                    }
                },
                orderBy: { sentAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            prisma.introductionRequest.count({ where: whereClause })
        ]);

        // Transform data to hide company details if confidential
        const transformedIntroductions = introductions.map((intro: any) => ({
            ...intro,
            company: intro.jobRole.isConfidential ? {
                id: 'confidential',
                companyName: 'Confidential Company',
                companyLogoUrl: null,
                industry: intro.company.industry,
                companySize: intro.company.companySize,
                headquartersLocation: 'Confidential',
            } : intro.company
        }));

        return NextResponse.json({
            message: 'Introduction requests retrieved successfully',
            data: {
                introductions: transformedIntroductions,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1,
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Get introduction requests error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch introduction requests' },
            { status: 500 }
        );
    }
}
