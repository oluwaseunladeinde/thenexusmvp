import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/database/prisma';

/**
 * @swagger
 * /api/v1/professionals/saved:
 *   get:
 *     summary: Get HR partner's saved professionals list
 *     tags: [Professionals, Saved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of saved professionals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 savedProfessionals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                       savedAt:
 *                         type: string
 *                         format: date-time
 *                       professional:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           profileHeadline:
 *                             type: string
 *                           currentTitle:
 *                             type: string
 *                           locationCity:
 *                             type: string
 *                           locationState:
 *                             type: string
 *                           verificationStatus:
 *                             type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       403:
 *         description: Insufficient permissions
 */

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // RBAC Check: Require permission to search professionals
        await requirePermission(Permission.SEARCH_PROFESSIONALS);

        // Get HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR Partner not found' },
                { status: 403 }
            );
        }

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        // Get saved professionals with pagination
        const [savedProfessionals, totalCount] = await Promise.all([
            prisma.savedProfessional.findMany({
                where: {
                    hrPartnerId: hrPartner.id,
                },
                include: {
                    professional: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileHeadline: true,
                            currentTitle: true,
                            locationCity: true,
                            locationState: true,
                            verificationStatus: true,
                            skills: {
                                select: {
                                    skillName: true,
                                },
                                take: 5, // Limit to top 5 skills
                            },
                        },
                    },
                },
                orderBy: {
                    savedAt: 'desc',
                },
                skip: offset,
                take: limit,
            }),
            prisma.savedProfessional.count({
                where: {
                    hrPartnerId: hrPartner.id,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            savedProfessionals: savedProfessionals.map(saved => ({
                id: saved.id,
                notes: saved.notes,
                savedAt: saved.savedAt.toISOString(),
                professional: {
                    ...saved.professional,
                    skills: saved.professional.skills.map(skill => skill.skillName),
                },
            })),
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages,
            },
        });

    } catch (err: any) {
        console.error('Get saved professionals error:', err);

        if (err.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch saved professionals' },
            { status: 500 }
        );
    }
}
