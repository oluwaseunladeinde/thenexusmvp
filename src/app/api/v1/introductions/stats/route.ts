import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/introductions/stats:
 *   get:
 *     summary: Get introduction request statistics for HR partner
 *     tags: [Introductions, HR Partners, Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Introduction statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSent:
 *                       type: integer
 *                       description: Total introduction requests sent
 *                       example: 45
 *                     pending:
 *                       type: integer
 *                       description: Number of pending requests
 *                       example: 12
 *                     accepted:
 *                       type: integer
 *                       description: Number of accepted requests
 *                       example: 18
 *                     declined:
 *                       type: integer
 *                       description: Number of declined requests
 *                       example: 8
 *                     expired:
 *                       type: integer
 *                       description: Number of expired requests
 *                       example: 7
 *                     acceptanceRate:
 *                       type: number
 *                       description: Acceptance rate as percentage
 *                       example: 40.0
 *                     averageResponseTime:
 *                       type: number
 *                       description: Average response time in hours
 *                       example: 48.5
 *                     thisMonth:
 *                       type: integer
 *                       description: Requests sent this month
 *                       example: 15
 *                     lastMonth:
 *                       type: integer
 *                       description: Requests sent last month
 *                       example: 22
 *                     trend:
 *                       type: string
 *                       enum: [up, down, stable]
 *                       description: Trend compared to last month
 *                       example: "up"
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
 *                   example: "Failed to fetch introduction statistics"
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

        // Find HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId: user.id },
            select: { id: true, companyId: true }
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR partner profile not found' }, { status: 404 });
        }

        // Get current date info for monthly comparisons
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Get all introduction requests for the company
        const allRequests = await prisma.introductionRequest.findMany({
            where: { companyId: hrPartner.companyId },
            select: {
                id: true,
                status: true,
                sentAt: true,
                responseDate: true,
                expiresAt: true,
            }
        });

        // Calculate basic stats
        const totalSent = allRequests.length;
        const pending = allRequests.filter(r => r.status === 'PENDING').length;
        const accepted = allRequests.filter(r => r.status === 'ACCEPTED').length;
        const declined = allRequests.filter(r => r.status === 'DECLINED').length;
        const expired = allRequests.filter(r => r.status === 'EXPIRED').length;

        // Calculate acceptance rate
        const responded = accepted + declined;
        const acceptanceRate = responded > 0 ? (accepted / responded) * 100 : 0;

        // Calculate average response time for accepted/declined requests
        const respondedRequests = allRequests.filter(r =>
            (r.status === 'ACCEPTED' || r.status === 'DECLINED') && r.responseDate
        );

        let averageResponseTime = 0;
        if (respondedRequests.length > 0) {
            const totalResponseTime = respondedRequests.reduce((sum, req) => {
                const sentTime = new Date(req.sentAt).getTime();
                const responseTime = new Date(req.responseDate!).getTime();
                return sum + (responseTime - sentTime);
            }, 0);
            averageResponseTime = totalResponseTime / respondedRequests.length / (1000 * 60 * 60); // Convert to hours
        }

        // Monthly comparison
        const thisMonth = allRequests.filter(r =>
            new Date(r.sentAt) >= startOfThisMonth
        ).length;

        const lastMonth = allRequests.filter(r =>
            new Date(r.sentAt) >= startOfLastMonth && new Date(r.sentAt) <= endOfLastMonth
        ).length;

        // Determine trend
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (thisMonth > lastMonth) {
            trend = 'up';
        } else if (thisMonth < lastMonth) {
            trend = 'down';
        }

        return NextResponse.json({
            message: 'Introduction statistics retrieved successfully',
            data: {
                totalSent,
                pending,
                accepted,
                declined,
                expired,
                acceptanceRate: Math.round(acceptanceRate * 10) / 10, // Round to 1 decimal
                averageResponseTime: Math.round(averageResponseTime * 10) / 10, // Round to 1 decimal
                thisMonth,
                lastMonth,
                trend,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Get introduction statistics error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch introduction statistics' },
            { status: 500 }
        );
    }
}
