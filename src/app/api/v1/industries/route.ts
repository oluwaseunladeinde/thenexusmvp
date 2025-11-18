import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { cacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

/**
 * @swagger
 * /api/v1/industries:
 *   get:
 *     summary: Get all active industries
 *     tags: [Industries]
 *     responses:
 *       200:
 *         description: Industries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Industry ID
 *                   industryName:
 *                     type: string
 *                     description: Industry name
 *                   industrySlug:
 *                     type: string
 *                     description: Industry slug
 *                 example:
 *                   - id: "uuid-1"
 *                     industryName: "Technology"
 *                     industrySlug: "technology"
 *                   - id: "uuid-2"
 *                     industryName: "Healthcare"
 *                     industrySlug: "healthcare"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch industries"
 */

export async function GET() {
    try {
        // Try to get from cache first
        const cachedIndustries = await cacheService.get(CACHE_KEYS.INDUSTRIES);
        if (cachedIndustries) {
            return NextResponse.json(cachedIndustries);
        }

        // Fetch from database
        const industries = await prisma.industry.findMany({
            where: { isActive: true },
            select: {
                id: true,
                industryName: true,
                industrySlug: true,
            },
            orderBy: { sortOrder: 'asc' },
        });

        // Cache the result
        await cacheService.set(CACHE_KEYS.INDUSTRIES, industries, { ttl: CACHE_TTL.INDUSTRIES });

        return NextResponse.json(industries);
    } catch (error) {
        console.error('Error fetching industries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch industries' },
            { status: 500 }
        );
    }
}
