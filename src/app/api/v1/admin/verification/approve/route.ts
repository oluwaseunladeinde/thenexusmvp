import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  approveProfessionalVerification,
  approveCompanyVerification,
} from '@/lib/services';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const approveSchema = z.object({
  entityType: z.enum(['professional', 'company']),
  entityId: z.string().min(1),
  verificationStatus: z.enum(['BASIC', 'FULL', 'PREMIUM', 'VERIFIED']),
  notes: z.string().optional().nullable(),
});

/**
 * @swagger
 * /api/v1/admin/verification/approve:
 *   post:
 *     summary: Approve verification
 *     description: Approve a professional or company verification
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
 *               - verificationStatus
 *             properties:
 *               entityType:
 *                 type: string
 *                 enum: [professional, company]
 *               entityId:
 *                 type: string
 *               verificationStatus:
 *                 type: string
 *                 enum: [BASIC, FULL, PREMIUM, VERIFIED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification approved successfully
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
    const validation = approveSchema.safeParse(body);

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

    const { entityType, entityId, verificationStatus, notes } = validation.data;

    // Approve verification based on entity type
    if (entityType === 'professional') {
      if (!['BASIC', 'FULL', 'PREMIUM'].includes(verificationStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid verification status for professional',
          },
          { status: 400 }
        );
      }

      await approveProfessionalVerification(
        entityId,
        verificationStatus as 'BASIC' | 'FULL' | 'PREMIUM',
        notes || null,
        user.id
      );

      return NextResponse.json({
        success: true,
        message: 'Professional verification approved',
      });
    } else {
      if (!['VERIFIED', 'PREMIUM'].includes(verificationStatus)) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification status for company' },
          { status: 400 }
        );
      }

      await approveCompanyVerification(
        entityId,
        verificationStatus as 'VERIFIED' | 'PREMIUM',
        notes || null,
        user.id
      );

      return NextResponse.json({
        success: true,
        message: 'Company verification approved',
      });
    }
  } catch (error) {
    console.error('Error approving verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
