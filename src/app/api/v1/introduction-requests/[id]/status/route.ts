import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const statusUpdateSchema = z.object({
    status: z.enum(['ACCEPTED', 'DECLINED'])
});

/**
 * @swagger
 * /api/v1/introduction-requests/{id}/status:
 *   patch:
 *     summary: Update introduction request status
 *     tags: [Introduction Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Introduction request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED]
 *                 description: New status for the introduction request
 *                 example: "ACCEPTED"
 *     responses:
 *       200:
 *         description: Introduction request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Updated introduction request object
 *       400:
 *         description: Invalid status or validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Introduction request not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId }
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR partner not found' }, { status: 404 });
        }

        const body = await request.json();
        const { status } = statusUpdateSchema.parse(body);

        // Find the introduction request and verify ownership through job role
        const introductionRequest = await prisma.introductionRequest.findFirst({
            where: {
                id: id,
                jobRole: {
                    companyId: hrPartner.companyId
                }
            },
            include: {
                jobRole: true,
                professional: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!introductionRequest) {
            return NextResponse.json({ error: 'Introduction request not found' }, { status: 404 });
        }

        // Update the status
        const updatedRequest = await prisma.introductionRequest.update({
            where: { id: id },
            data: { status }
        });

        // Send notification to the professional about the status change
        await prisma.notification.create({
            data: {
                userId: introductionRequest.professional.user.id,
                notificationType: 'INTRO_REQUEST',
                title: `Introduction Request ${status.toLowerCase()}`,
                message: `Your introduction request for "${introductionRequest.jobRole.roleTitle}" has been ${status.toLowerCase()}.`,
                relatedEntityType: 'introduction_request',
                relatedEntityId: id,
                actionUrl: `/professional/introductions/${id}`,
                channel: 'IN_APP',
            }
        });
        // This could be implemented as a separate notification system

        return NextResponse.json({ success: true, data: updatedRequest });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        console.error('Error updating introduction request status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
