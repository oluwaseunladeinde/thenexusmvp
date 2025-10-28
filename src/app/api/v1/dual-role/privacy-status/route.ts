import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/dual-role/privacy-status:
 *   get:
 *     summary: Get privacy firewall status for dual-role users
 *     tags: [Privacy, Dual Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Privacy status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockedCompaniesCount:
 *                   type: integer
 *                   description: Number of companies blocked from viewing profile
 *                   example: 5
 *                 lastFirewallEvent:
 *                   type: string
 *                   format: date-time
 *                   description: ISO timestamp of last firewall event
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 lastEventType:
 *                   type: string
 *                   enum: [BLOCK, UNBLOCK]
 *                   description: Type of last firewall event
 *                   example: "BLOCK"
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
 */

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get professional profile
        const professional = await prisma.professional.findUnique({
            where: { userId },
            select: {
                id: true,
                hideFromCompanyIds: true,
            },
        });

        if (!professional) {
            return NextResponse.json(
                { error: 'Professional profile not found' },
                { status: 404 }
            );
        }

        // Get last firewall event
        const lastFirewallEvent = await prisma.privacyFirewallLog.findFirst({
            where: {
                professionalId: professional.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                createdAt: true,
                eventType: true,
            },
        });

        return NextResponse.json({
            blockedCompaniesCount: professional.hideFromCompanyIds.length,
            lastFirewallEvent: lastFirewallEvent?.createdAt.toISOString(),
            lastEventType: lastFirewallEvent?.eventType,
        });
    } catch (error: any) {
        console.error('Error fetching privacy status:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch privacy status' },
            { status: 500 }
        );
    }
}