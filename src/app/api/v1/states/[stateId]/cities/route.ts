import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { cacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

/**
 * @swagger
 * /api/v1/states/{stateId}/cities:
 *   get:
 *     summary: Get all active cities for a specific state
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema:
 *           type: string
 *         description: State ID
 *         example: "uuid-123"
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: City ID
 *                   name:
 *                     type: string
 *                     description: City name
 *                 example:
 *                   - id: "uuid-1"
 *                     name: "Lagos Island"
 *                   - id: "uuid-2"
 *                     name: "Victoria Island"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch cities"
 */

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ stateId: string }> }
) {
    try {
        const { stateId } = await params;

        // Try to get from cache first
        const cacheKey = CACHE_KEYS.CITIES(stateId);
        const cachedCities = await cacheService.get(cacheKey);
        if (cachedCities) {
            return NextResponse.json(cachedCities);
        }

        // Fetch from database
        const cities = await prisma.city.findMany({
            where: {
                stateId,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: 'asc' },
        });

        // Cache the result
        await cacheService.set(cacheKey, cities, { ttl: CACHE_TTL.CITIES });

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cities' },
            { status: 500 }
        );
    }
}
