import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

/**
 * @swagger
 * /api/v1/introductions/{id}/decline:
 *   post:
 *     summary: Decline an introduction request
 *     tags: [Introductions, Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Introduction request ID
 *         example: "intro_123"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Optional response message to the HR partner
 *                 maxLength: 500
 *                 example: "Thank you for considering me, but I'm not interested in this opportunity at this time."
 *     responses:
 *       200:
 *         description: Introduction request declined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Introduction request declined successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     introduction:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         sentToProfessionalId:
 *                           type: string
 *                         sentById:
 *                           type: string
 *                         jobRoleId:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [DECLINED]
 *                         message:
 *                           type: string
 *                         professionalResponse:
 *                           type: string
 *                           nullable: true
 *                         sentAt:
 *                           type: string
 *                           format: date-time
 *                         responseDate:
 *                           type: string
 *                           format: date-time
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                         viewedByProfessional:
 *                           type: boolean
 *                         viewedAt:
 *                           type: string
 *                           format: date-time
 *                         jobRole:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             roleTitle:
 *                               type: string
 *                             seniorityLevel:
 *                               type: string
 *                             locationCity:
 *                               type: string
 *                               nullable: true
 *                             locationState:
 *                               type: string
 *                               nullable: true
 *                             salaryRangeMin:
 *                               type: number
 *                               nullable: true
 *                             salaryRangeMax:
 *                               type: number
 *                               nullable: true
 *                         company:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             companyName:
 *                               type: string
 *                             industry:
 *                               type: string
 *       400:
 *         description: Invalid request or introduction not actionable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Introduction request not found or already responded to"
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
 *         description: Introduction request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Introduction request not found or already responded to"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to decline introduction request"
 */

const declineSchema = z.object({
    message: z.string().optional(),
});

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userType = user.unsafeMetadata?.userType as string;
        if (!userType || userType !== 'professional') {
            return NextResponse.json({ error: 'Forbidden: Professional access required' }, { status: 403 });
        }

        const body = await request.json();
        const { message } = declineSchema.parse(body);

        // Find professional
        const professional = await prisma.professional.findUnique({
            where: { userId: user.id },
            select: { id: true, firstName: true, lastName: true }
        });

        if (!professional) {
            return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
        }

        // Find and validate introduction request
        const introductionRequest = await prisma.introductionRequest.findFirst({
            where: {
                id: params.id,
                sentToProfessionalId: professional.id,
                status: 'PENDING'
            },
            include: {
                jobRole: { select: { roleTitle: true } },
                sentBy: { select: { userId: true } }
            }
        });

        if (!introductionRequest) {
            return NextResponse.json({
                error: 'Introduction request not found or already responded to'
            }, { status: 404 });
        }

        // Check if request has expired
        if (new Date() > introductionRequest.expiresAt) {
            return NextResponse.json({
                error: 'Introduction request has expired'
            }, { status: 400 });
        }

        // Update introduction request status
        const updatedIntroduction = await prisma.introductionRequest.update({
            where: { id: params.id },
            data: {
                status: 'DECLINED',
                professionalResponse: message || null,
                responseDate: new Date(),
                viewedByProfessional: true,
                viewedAt: new Date(),
            },
            include: {
                jobRole: {
                    select: {
                        id: true,
                        roleTitle: true,
                        seniorityLevel: true,
                        locationCity: true,
                        locationState: true,
                        salaryRangeMin: true,
                        salaryRangeMax: true,
                    }
                },
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        industry: true,
                    }
                }
            }
        });

        // Create notification for HR partner
        await prisma.notification.create({
            data: {
                userId: introductionRequest.sentBy.userId,
                notificationType: 'INTRO_DECLINED',
                title: 'Introduction Request Declined',
                message: `${professional.firstName} ${professional.lastName} has declined your introduction request for ${introductionRequest.jobRole.roleTitle}`,
                relatedEntityType: 'introduction_request',
                relatedEntityId: params.id,
                actionUrl: `/dashboard/introductions/${params.id}`,
                channel: 'IN_APP',
            }
        });

        return NextResponse.json({
            message: 'Introduction request declined successfully',
            data: {
                introduction: updatedIntroduction,
            }
        }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.issues
            }, { status: 422 });
        }

        console.error('Decline introduction request error:', error);
        return NextResponse.json(
            { error: 'Failed to decline introduction request' },
            { status: 500 }
        );
    }
}
