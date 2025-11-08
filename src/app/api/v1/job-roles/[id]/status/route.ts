import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'FILLED', 'CLOSED'])
});

const validTransitions: Record<string, string[]> = {
  DRAFT: ['ACTIVE', 'CLOSED'],
  ACTIVE: ['PAUSED', 'FILLED', 'CLOSED'],
  PAUSED: ['ACTIVE', 'CLOSED'],
  FILLED: ['CLOSED'],
  CLOSED: []
};

/**
 * @swagger
 * /api/v1/job-roles/{id}/status:
 *   patch:
 *     summary: Update job role status
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job role ID
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
 *                 enum: [DRAFT, ACTIVE, PAUSED, FILLED, CLOSED]
 *                 description: New status for the job role
 *                 example: "ACTIVE"
 *             example:
 *               status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Job role status updated successfully
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
 *                   description: Updated job role object
 *       400:
 *         description: Invalid status transition or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid status transition from CLOSED to ACTIVE"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Validation error details (if applicable)
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Job role or HR partner not found
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

    const existingJobRole = await prisma.jobRole.findFirst({
      where: {
        id: id,
        companyId: hrPartner.companyId
      }
    });

    if (!existingJobRole) {
      return NextResponse.json({ error: 'Job role not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status } = statusUpdateSchema.parse(body);

    // Validate status transition
    const currentStatus = existingJobRole.status;
    if (!validTransitions[currentStatus].includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    const updateData: any = { status };

    // Set timestamps based on status
    if (status === 'ACTIVE' && currentStatus === 'DRAFT') {
      updateData.publishedAt = new Date();
    }
    if (status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const updatedJobRole = await prisma.jobRole.update({
      where: { id: id },
      data: updateData,
      include: {
        company: {
          select: { companyName: true }
        }
      }
    });

    // Send notifications to professionals with pending introductions
    if (status === 'CLOSED' || status === 'FILLED') {
      const pendingIntroductions = await prisma.introductionRequest.findMany({
        where: {
          jobRoleId: id,
          status: 'PENDING'
        },
        include: {
          professional: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              user: {
                select: { id: true }
              }
            }
          }
        }
      });

      for (const intro of pendingIntroductions) {
        await prisma.notification.create({
          data: {
            userId: intro.professional.user.id,
            notificationType: 'SYSTEM_ALERT',
            title: `Job Role ${status.toLowerCase()}: ${updatedJobRole.roleTitle}`,
            message: `The job role "${updatedJobRole.roleTitle}" at ${updatedJobRole.company.companyName} has been ${status.toLowerCase()}. Thank you for your interest.`,
            relatedEntityType: 'job_role',
            relatedEntityId: id,
            actionUrl: `/professional/introductions/${intro.id}`,
            channel: 'IN_APP',
          }
        });
      }
    }

    return NextResponse.json({ success: true, data: updatedJobRole });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error updating job role status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
