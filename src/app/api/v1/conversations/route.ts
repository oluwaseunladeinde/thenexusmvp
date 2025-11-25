import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

/**
 * @swagger
 * /api/v1/conversations:
 *   post:
 *     summary: Start a new conversation between HR partner and professional
 *     tags: [Conversations, Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - introductionRequestId
 *               - initialMessage
 *             properties:
 *               introductionRequestId:
 *                 type: string
 *                 description: ID of the accepted introduction request
 *               initialMessage:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: Initial message to start the conversation
 *     responses:
 *       201:
 *         description: Conversation started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conversation started successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversation:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         introductionRequestId:
 *                           type: string
 *                         hrPartnerId:
 *                           type: string
 *                         professionalId:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [ACTIVE]
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         lastMessageAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request data"
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
 *         description: Forbidden - introduction not accepted or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Introduction request not accepted or access denied"
 *       404:
 *         description: Introduction request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Introduction request not found"
 *       409:
 *         description: Conversation already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conversation already exists for this introduction"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to start conversation"
 */

const startConversationSchema = z.object({
    introductionRequestId: z.string(),
    initialMessage: z.string().min(10).max(1000),
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR Partner not found' }, { status: 404 });
        }

        // Parse and validate request body
        const body = await req.json();
        const { introductionRequestId, initialMessage } = startConversationSchema.parse(body);

        // Check if introduction request exists and is accepted
        const introductionRequest = await prisma.introductionRequest.findFirst({
            where: {
                id: introductionRequestId,
                sentByHrId: hrPartner.id,
                status: 'ACCEPTED'
            },
            select: {
                id: true,
                sentToProfessionalId: true,
                jobRole: {
                    select: { roleTitle: true }
                }
            }
        });

        if (!introductionRequest) {
            return NextResponse.json({
                error: 'Introduction request not found or not accepted'
            }, { status: 404 });
        }

        // Check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                introductionRequestId,
                hrPartnerId: hrPartner.id,
                professionalId: introductionRequest.sentToProfessionalId
            }
        });

        if (existingConversation) {
            return NextResponse.json({
                error: 'Conversation already exists for this introduction'
            }, { status: 409 });
        }

        // Create conversation and initial message in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create conversation
            const conversation = await tx.conversation.create({
                data: {
                    introductionRequestId,
                    hrPartnerId: hrPartner.id,
                    professionalId: introductionRequest.sentToProfessionalId,
                    status: 'ACTIVE',
                }
            });

            // Create initial message
            const message = await tx.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: hrPartner.id,
                    senderType: 'HR_PARTNER',
                    content: initialMessage,
                }
            });

            // Update conversation's lastMessageAt
            await tx.conversation.update({
                where: { id: conversation.id },
                data: { lastMessageAt: message.sentAt }
            });

            return { conversation, message };
        });

        // Get professional userId for notification
        const professional = await prisma.professional.findUnique({
            where: { id: introductionRequest.sentToProfessionalId },
            select: { userId: true }
        });

        if (!professional) {
            console.error('Professional not found for notification:', introductionRequest.sentToProfessionalId);
            // Continue without notification rather than failing the entire request
        } else {
            // Send notification to professional
            await prisma.notification.create({
                data: {
                    userId: professional.userId,
                    notificationType: 'CONVERSATION_STARTED',
                    title: 'New Conversation Started',
                    message: `A conversation has been started regarding your introduction for ${introductionRequest.jobRole.roleTitle}`,
                    relatedEntityType: 'conversation',
                    relatedEntityId: result.conversation.id,
                    actionUrl: `/conversations/${result.conversation.id}`,
                    channel: 'IN_APP',
                }
            });
        }

        return NextResponse.json({
            message: 'Conversation started successfully',
            data: {
                conversation: {
                    id: result.conversation.id,
                    introductionRequestId,
                    hrPartnerId: hrPartner.id,
                    professionalId: introductionRequest.sentToProfessionalId,
                    status: result.conversation.status,
                    createdAt: result.conversation.createdAt,
                    lastMessageAt: result.message.sentAt,
                }
            }
        }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Invalid request data',
                details: error.issues
            }, { status: 400 });
        }

        console.error('Start conversation error:', error);
        return NextResponse.json(
            { error: 'Failed to start conversation' },
            { status: 500 }
        );
    }
}
