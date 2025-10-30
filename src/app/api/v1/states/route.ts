import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { cacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { redis } from '@/lib/services';

/**
 * @swagger
 * /api/v1/states:
 *   get:
 *     summary: Get all active states
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: States retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: State ID
 *                   name:
 *                     type: string
 *                     description: State name
 *                   code:
 *                     type: string
 *                     description: State code
 *                 example:
 *                   - id: "uuid-1"
 *                     name: "Lagos"
 *                     code: "LA"
 *                   - id: "uuid-2"
 *                     name: "Abuja"
 *                     code: "AB"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch states"
 */

export async function GET() {
    try {
        // Try to get from cache first
        const cachedStates = await cacheService.get(CACHE_KEYS.STATES);
        if (cachedStates) {
            return NextResponse.json(cachedStates);
        }

        // Fetch from database
        const states = await prisma.state.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                code: true,
            },
            orderBy: { name: 'asc' },
        });

        // Cache the result
        await cacheService.set(CACHE_KEYS.STATES, states, { ttl: CACHE_TTL.STATES });

        return NextResponse.json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        return NextResponse.json(
            { error: 'Failed to fetch states' },
            { status: 500 }
        );
    }
}
