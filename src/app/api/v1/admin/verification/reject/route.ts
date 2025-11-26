import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  rejectProfessionalVerification,
  rejectCompanyVerification,
} from '@/lib/services';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const rejectSchema = z.object({
  entityType: z.enum(['professional', 'company']),
  entityId: z.string().min(1),
  reason: z.string().min(1, 'Rejection reason is required'),
});

/**
 * @swagger
 * /api/v1/admin/verification/reject:
 *   post:
 *     summary: Reject verification
 *     description: Reject a professional or company verification with a reason
 *     tags:
 *       - Admin
 *       - Verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityType
 *               - entityId
 *               - reason
 *             properties:
 *               entityType:
 *                 type: string
 *                 enum: [professional, company]
 *               entityId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification rejected successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true, userType: true },
    });

    if (!user || user.userType !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const validation = rejectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { entityType, entityId, reason } = validation.data;

    // Reject verification based on entity type
    if (entityType === 'professional') {
      await rejectProfessionalVerification(entityId, reason, user.id);

      return NextResponse.json({
        success: true,
        message: 'Professional verification rejected',
      });
    } else {
      await rejectCompanyVerification(entityId, reason, user.id);

      return NextResponse.json({
        success: true,
        message: 'Company verification rejected',
      });
    }
  } catch (error) {
    console.error('Error rejecting verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
