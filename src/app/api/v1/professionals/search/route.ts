import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/professionals/search:
 *   post:
 *     summary: Search for professionals (HR Partners only)
 *     tags: [Professionals, Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Search criteria for professionals
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required skills
 *               location:
 *                 type: string
 *                 description: Location filter
 *               industry:
 *                 type: string
 *                 description: Industry filter
 *               experience:
 *                 type: number
 *                 description: Minimum years of experience
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                 description: Salary range filter
 *     responses:
 *       200:
 *         description: Professionals found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 professionals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professional'
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
 *         description: Forbidden - insufficient permissions or HR partner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Insufficient permissions"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Search failed"
 */

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // RBAC Check: Require permission to search professionals
        await requirePermission(Permission.SEARCH_PROFESSIONALS);

        // Get HR partner making the search
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true, companyId: true },
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR Partner not found' },
                { status: 403 }
            );
        }

        // Proceed with search...
        const searchCriteria = await req.json();

        const professionals = await prisma.professional.findMany({
            where: {
                ...searchCriteria,
                openToOpportunities: true,
                // Privacy firewall
                NOT: {
                    hideFromCompanyIds: {
                        has: hrPartner.companyId,
                    },
                },
            },
        });

        return NextResponse.json({ professionals });
    } catch (err: any) {
        if (err.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        );
    }
}