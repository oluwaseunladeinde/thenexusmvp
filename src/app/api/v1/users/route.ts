// src/app/api/v1/users/route.ts
import { requireAdmin } from '@/lib/auth/rbac';
import { prisma } from '@/lib/database';
import logger from '@/lib/services/logger';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
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

export async function GET(request: Request) {

    // check that this user is an admin user
    const user = await requireAdmin()
    logger.info(`${user.firstName} check for all users`);

    // Add authentication/authorization (see previous comment)
    try {
        // Add pagination
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Select only non-sensitive fields
        const users = await prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                createdAt: true,
                // Exclude password, tokens, and other sensitive fields
            }
        });

        const total = await prisma.user.count();
        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
