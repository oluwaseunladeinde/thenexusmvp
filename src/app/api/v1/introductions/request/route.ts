import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { introductionRequestSchema } from '@/lib/schemas/api-schemas';
import { hasPermission, Permission } from '@/lib/auth/rbac';
import { getSubscriptionInfo } from '@/lib/subscription';
import { createNotification } from '@/lib/notifications';

/**
 * @swagger
 * /api/v1/introductions/request:
 *   post:
 *     summary: Send introduction request to professional
 *     tags: [Introductions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professionalId
 *               - jobRoleId
 *               - personalizedMessage
 *             properties:
 *               professionalId:
 *                 type: string
 *                 description: ID of the professional to send request to
 *               jobRoleId:
 *                 type: string
 *                 description: ID of the job role for the introduction
 *               personalizedMessage:
 *                 type: string
 *                 minLength: 50
 *                 maxLength: 1000
 *                 description: Personalized message to the professional
 *     responses:
 *       201:
 *         description: Introduction request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid request data or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Insufficient permissions or credits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Professional or job role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Duplicate introduction request
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

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get HR partner and check permissions
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            include: {
                company: true,
            },
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR Partner not found' }, { status: 404 });
        }

        // Check RBAC permissions
        const allowed = await hasPermission(Permission.SEND_INTRODUCTION_REQUESTS);
        if (!allowed) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Parse and validate request body
        const body = await req.json();
        const validationResult = introductionRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({
                error: 'Invalid request data',
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            }, { status: 400 });
        }

        const { professionalId, jobRoleId, personalizedMessage } = validationResult.data;

        // Check if professional exists and is available
        const professional = await prisma.professional.findUnique({
            where: { id: professionalId },
            select: {
                id: true,
                userId: true,
                openToOpportunities: true,
                hideFromCompanyIds: true,
            },
        });

        if (!professional) {
            return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
        }

        if (!professional.openToOpportunities) {
            return NextResponse.json({ error: 'Professional is not open to opportunities' }, { status: 403 });
        }

        // Check privacy firewall - if professional has blocked this company
        if (professional.hideFromCompanyIds.includes(hrPartner.companyId)) {
            return NextResponse.json({ error: 'Professional has blocked this company' }, { status: 403 });
        }

        // Check if job role exists and belongs to HR partner's company
        const jobRole = await prisma.jobRole.findFirst({
            where: {
                id: jobRoleId,
                companyId: hrPartner.companyId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                roleTitle: true,
            },
        });

        if (!jobRole) {
            return NextResponse.json({ error: 'Job role not found or not active' }, { status: 404 });
        }

        // Check for duplicate pending introduction request
        const existingRequest = await prisma.introductionRequest.findFirst({
            where: {
                jobRoleId,
                sentToProfessionalId: professionalId,
                status: 'PENDING',
            },
        });

        if (existingRequest) {
            return NextResponse.json({ error: 'Introduction request already exists for this professional and role' }, { status: 409 });
        }

        // Check introduction credits
        const subscription = await getSubscriptionInfo();
        if (!subscription || subscription.creditsRemaining <= 0) {
            return NextResponse.json({ error: 'Insufficient introduction credits' }, { status: 403 });
        }

        // Use transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Create introduction request
            const introductionRequest = await tx.introductionRequest.create({
                data: {
                    jobRoleId,
                    companyId: hrPartner.companyId,
                    sentByHrId: hrPartner.id,
                    sentToProfessionalId: professionalId,
                    personalizedMessage,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
            });

            // Deduct 1 credit from company
            await tx.company.update({
                where: { id: hrPartner.companyId },
                data: {
                    introductionCredits: {
                        decrement: 1,
                    },
                },
            });

            return introductionRequest;
        });

        // Send notification to professional
        await createNotification({
            userId: professional.userId,
            notificationType: 'INTRO_REQUEST',
            title: 'New Introduction Request',
            message: `You have received an introduction request for ${jobRole.roleTitle} from ${hrPartner.company.companyName}`,
            relatedEntityType: 'introduction_request',
            relatedEntityId: result.id,
            actionUrl: `/dashboard/introductions/${result.id}`,
            channel: 'IN_APP',
        });

        // Log activity
        await prisma.userActivityLog.create({
            data: {
                userId,
                actionType: 'INTRODUCTION_REQUEST_SENT',
                entityType: 'introduction_request',
                entityId: result.id,
                description: `Sent introduction request to professional ${professionalId} for job role ${jobRoleId}`,
                metadata: {
                    professionalId,
                    jobRoleId,
                    companyId: hrPartner.companyId,
                },
            },
        });

        return NextResponse.json({
            message: 'Introduction request sent successfully',
            data: {
                introductionRequest: {
                    id: result.id,
                    professionalId,
                    jobRoleId,
                    status: result.status,
                    expiresAt: result.expiresAt,
                    sentAt: result.sentAt,
                },
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Send introduction request error:', error);
        return NextResponse.json(
            { error: 'Failed to send introduction request' },
            { status: 500 }
        );
    }
}
