import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/introductions/sent:
 *   get:
 *     summary: Get introduction requests sent by HR partner's company
 *     tags: [Introductions, HR Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, DECLINED, EXPIRED, all]
 *         description: "Filter by introduction status (default: all)"
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
 *                             enum: [PENDING, ACCEPTED, DECLINED, EXPIRED]
 *                           personalizedMessage:
 *                             type: string
 *                             description: Message sent to professional
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
 *                           professional:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               profileHeadline:
 *                                 type: string
 *                                 nullable: true
 *                               currentTitle:
 *                                 type: string
 *                                 nullable: true
 *                               locationCity:
 *                                 type: string
 *                               locationState:
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
 *         description: Forbidden - HR partner access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden: HR partner access required"
 *       404:
 *         description: HR partner profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "HR partner profile not found"
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
        if (!userType || userType !== 'hr_partner') {
            return NextResponse.json({ error: 'Forbidden: HR partner access required' }, { status: 403 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Validate pagination parameters
        if (page < 1) {
            return NextResponse.json({ error: 'Page must be at least 1' }, { status: 400 });
        }
        if (limit < 1 || limit > 100) {
            return NextResponse.json({ error: 'Limit must be between 1 and 100' }, { status: 400 });
        }
        if (status && status !== 'all' && !['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED'].includes(status.toUpperCase())) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        const offset = (page - 1) * limit;

        // Find HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId: user.id },
            select: { id: true, companyId: true }
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR partner profile not found' }, { status: 404 });
        }

        // Build where clause
        const whereClause: any = {
            companyId: hrPartner.companyId
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
                            responsibilities: true,
                            requirements: true,
                            preferredQualifications: true,
                            benefits: true,
                            isConfidential: true,
                            confidentialReason: true,
                        }
                    },
                    professional: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileHeadline: true,
                            currentTitle: true,
                            locationCity: true,
                            locationState: true,
                            profilePhotoUrl: true,
                            linkedinUrl: true,
                        }
                    }
                },
                orderBy: { sentAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            prisma.introductionRequest.count({ where: whereClause })
        ]);

        return NextResponse.json({
            message: 'Introduction requests retrieved successfully',
            data: {
                introductions,
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
        console.error('Get sent introduction requests error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch introduction requests' },
            { status: 500 }
        );
    }
}
